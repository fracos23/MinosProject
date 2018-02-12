pizzeriaTableManager = function() {

	table = function() {
		var $dataTable;

		var getRowByTableId = function(tableId) {
			var $rows = $dataTable.$('tr');

			for (var i = 0; i < $rows.length; i++) {
				var $row = $rows.eq(i);
				var rowData = $dataTable.row($row).data();
				if (rowData.id == tableId) {
					return $row;
				}
			}
		};

		return {
			initDataTable : function() {
				$dataTable = $('#pizzeria-table #tables-table').DataTable({
					paging : false,
					searching : false,
					ajax : {
						url : "/pizzeria/tablesList",
						dataSrc : '',
					},
					columns : [ {
						'data' : 'number'
					}, {
						'data' : 'minSeats'
					}, {
						'data' : 'maxSeats'
					}, {
						'data' : 'available'
					} ],
					/*
					 * Renders "Yes" or "No" instead of "true" or "false" in the
					 * "Available" column.
					 */
					columnDefs : [ {
						render : function(data, type, row) {
							return data ? 'Yes' : 'No';
						},
						targets : 3
					} ],
					createdRow : function(row, data, index) {
						if (!data.available) {
							$(row).addClass('highlighted');
						}
					},
				});
			},

			isRowSelected : function($row) {
				return $row.hasClass('selected');
			},

			getSelectedRow : function() {
				var $selectedRow = $('#pizzeria-table #tables-table tr.selected');

				/*
				 * This method returns undefined to be consistent with the other
				 * getRow methods.
				 */
				if ($selectedRow.length > 0) {
					return $selectedRow;
				}
			},

			getRowByTableNumber : function(tableNumber) {
				var $rows = $dataTable.$('tr');

				for (var i = 0; i < $rows.length; i++) {
					var $row = $rows.eq(i);
					var rowData = $dataTable.row($row).data();
					if (rowData.number == tableNumber) {
						return $row;
					}
				}
			},

			containsTableNumber : function(tableNumber) {
				return _.contains($dataTable.column(0).data(), tableNumber);
			},

			getRowData : function($row) {
				return $dataTable.row($row).data();
			},

			selectRow : function($row) {
				var $tablesTable = $row.closest('#pizzeria-table #tables-table');
				$tablesTable.find('.selected').removeClass('selected');
				$row.addClass('selected');
			},

			clearRowSelection : function() {
				$('#pizzeria-table #tables-table tr.selected').removeClass('selected');
			},

			isAvailable : function($row) {
				return $dataTable.row($row).data().available;
			},

			addRow : function(rowData) {
				$dataTable.row.add({
					id : rowData.id,
					number : rowData.number,
					minSeats : rowData.minSeats,
					maxSeats : rowData.maxSeats,
					available : rowData.available
				}).draw();
			},

			editRow : function(rowData) {
				var $row = getRowByTableId(rowData.id);

				/*
				 * Just copy the old value for available, since there's no way
				 * to edit it here.
				 */
				rowData.available = $dataTable.row($row).data().available;

				if ($row != undefined) {
					$dataTable.row($row).data(rowData).draw();
				}
			},

			deleteRow : function(rowData) {
				var $row = getRowByTableId(rowData.id);

				if ($row != undefined) {
					$dataTable.row($row).remove().draw();
				}
			}
		}
	}();

	form = function() {
		var setHighlighted = function($element, highlighted) {
			if (highlighted) {
				$element.closest('.form-group').addClass('has-error');
			} else {
				$element.closest('.form-group').removeClass('has-error');
			}
		}

		return {
			setAddButtonEnabled : function(enabled) {
				if (enabled) {
					$("#pizzeria-table .button-add").removeAttr("disabled");
				} else {
					$("#pizzeria-table .button-add").attr("disabled", "disabled");
				}
			},

			setUpdateButtonEnabled : function(enabled) {
				if (enabled) {
					$("#pizzeria-table .button-update").removeAttr("disabled");
				} else {
					$("#pizzeria-table .button-update").attr("disabled", "disabled");
				}
			},

			setDeleteButtonEnabled : function(enabled) {
				if (enabled) {
					$("#pizzeria-table .button-delete").removeAttr("disabled");
				} else {
					$("#pizzeria-table .button-delete").attr("disabled", "disabled");
				}
			},

			setNumberFieldHighlighted : function(highlighted) {
				var $number = $('#pizzeria-table #table-number');

				setHighlighted($number, highlighted);
			},

			setSeatsFieldsHighlighted : function(highlighted) {
				var $minSeats = $('#pizzeria-table #table-min-seats');
				var $maxSeats = $('#pizzeria-table #table-max-seats');

				setHighlighted($minSeats, highlighted);
				setHighlighted($maxSeats, highlighted);
			},

			showTooltip : function(buttonClass, text) {
				/*
				 * If a tooltip is already shown, change the text and show the
				 * new one.
				 */
				var $button = $('.buttons-container .' + buttonClass);
				$button.attr('data-original-title', text);
				$button.tooltip({
					trigger : 'manual'
				}).tooltip('fixTitle').tooltip('show');
			},

			hideTooltips : function() {
				$('#pizzeria-table button').tooltip('hide');
			},

			clearForm : function() {
				$('#pizzeria-table .edit-table-form input').val(null);
			},

			fillForm : function(rowData) {
				$('#pizzeria-table #table-number').val(rowData.number);
				$('#pizzeria-table #table-min-seats').val(rowData.minSeats);
				$('#pizzeria-table #table-max-seats').val(rowData.maxSeats);
			},

			getFormData : function() {
				return {
					number : parseInt($('#pizzeria-table #table-number').val()),
					minSeats : parseInt($('#pizzeria-table #table-min-seats').val()),
					maxSeats : parseInt($('#pizzeria-table #table-max-seats').val())
				}
			},

			isFilled : function() {
				var $inputs = $('#pizzeria-table .edit-table-form input');
				for (var i = 0; i < $inputs.length; i++) {
					if ($inputs.eq(i).val().length <= 0) {
						return false;
					}
				}

				return true;
			}
		}
	}();

	/**
	 * Returns true if the form and the selected row contain the same number,
	 * same minSeats and same maxSeats.
	 */
	var formDataEqualsSelectedRowData = function() {
		var formData = form.getFormData();
		var $selectedRow = table.getSelectedRow();

		if ($selectedRow != undefined) {
			var rowData = table.getRowData($selectedRow);
			return formData.number == rowData.number && formData.minSeats == rowData.minSeats
					&& formData.maxSeats == rowData.maxSeats;
		}

		return false;
	}

	/**
	 * Validates the data in the form: returns true if the form contains a valid
	 * table that can be added, false otherwise.
	 * 
	 * This function also manages highlighting of wrong fields, if any.
	 */
	var canAdd = function() {
		var canAdd = true;

		/* Check if all the form fields are filled. */
		if (!form.isFilled()) {
			return false;
		}

		/*
		 * Check if minSeats <= maxSeats and vice versa. Form data can safely be
		 * retrieved since at this point we're sure the form is filled.
		 */
		var formData = form.getFormData();
		if (formData.minSeats > formData.maxSeats) {
			form.setSeatsFieldsHighlighted(true);
			form.showTooltip('button-add', 'Minimum seats are less than maximum seats.');
			canAdd = false;
		} else {
			/* Fields are ok, clear existing highlighting if any. */
			form.setSeatsFieldsHighlighted(false);
		}

		/*
		 * Check if the user is trying to add a table with an already existing
		 * number.
		 */
		var newTableNumber = form.getFormData().number;
		if (table.containsTableNumber(newTableNumber)) {
			form.setNumberFieldHighlighted(true);
			form.showTooltip('button-add', 'A table with this number already exists.');
			canAdd = false;
		} else {
			/* Field is ok, clear existing highlighting if any. */
			form.setNumberFieldHighlighted(false);
		}

		if (canAdd) {
			/* Form is ok, hide tooltips if any. */
			form.hideTooltips();
		}

		return canAdd;
	}

	var canUpdate = function($row) {
		var canUpdate = true;

		/* Check if all the form fields are filled. */
		if (!form.isFilled()) {
			return false;
		}

		/*
		 * Check if, according to the data received by the server, the table
		 * belongs to a Booking
		 */
		if (!table.isAvailable($row)) {
			return false;
		}

		/*
		 * Check if minSeats <= maxSeats and vice versa. Form data can safely be
		 * retrieved since at this point we're sure the form is filled.
		 */
		var formData = form.getFormData();
		if (formData.minSeats > formData.maxSeats) {
			form.setSeatsFieldsHighlighted(true);
			form.showTooltip('button-update', 'Minimum seats are less than maximum seats.');
			canUpdate = false;
		} else {
			/* Fields are ok, clear existing highlighting if any. */
			form.setSeatsFieldsHighlighted(false);
		}

		/*
		 * Check if the user is trying to update a table assigning a number
		 * which already belongs to another table.
		 */
		var formData = form.getFormData();
		var $rowByNumber = table.getRowByTableNumber(formData.number);
		if ($rowByNumber != undefined && !table.isRowSelected($rowByNumber)) {
			form.setNumberFieldHighlighted(true);
			form.showTooltip('button-update', 'A table with this number already exists.');
			canUpdate = false;
		} else {
			/* Field is ok, clear existing highlighting if any. */
			form.setNumberFieldHighlighted(false);
		}

		if (canUpdate) {
			/* Form is ok, remove tooltips if any. */
			form.hideTooltips();
		}

		/*
		 * If the form and the selected row contain the same data the update
		 * would be redundant. This doesn't involve highlighting at all but
		 * update is forbidden anyway in this case.
		 */
		if (formDataEqualsSelectedRowData()) {
			return false;
		}

		return canUpdate;
	}

	var canDelete = function($row) {
		/* Check if all the form fields are filled. */
		if (!form.isFilled()) {
			return false;
		}

		/* Check if form data is equal to the selected row data. */
		if (!formDataEqualsSelectedRowData()) {
			return false;
		}

		/*
		 * Check if, according to the data received by the server, the table is
		 * contained in a booking.
		 */
		if (!table.isAvailable($row)) {
			return false;
		}

		return true;
	}

	var getDataForRequest = function() {
		var data = new Object();
		var $selectedRow = table.getSelectedRow();

		if ($selectedRow != undefined) {
			data.id = table.getRowData($selectedRow).id;
		} else {
			data.id = -1;
		}

		var formData = form.getFormData();

		data.number = formData.number;
		data.minSeats = formData.minSeats;
		data.maxSeats = formData.maxSeats;

		return data;
	}

	/**
	 * Sends a request to the server to add, delete or update a table.
	 * 
	 * The action parameter can either be 'add', 'update' or 'delete'.
	 * 
	 * The data parameter is meant to be retrieved by the getDataForRequest
	 * function.
	 * 
	 * The onSuccess parameter is a callback function meant to be called when
	 * the response is successfully received.
	 */
	var sendRequest = function(action, data, onSuccess) {
		$.ajax({
			method : 'post',
			url : '/pizzeria/tables',
			dataType : 'json',
			data : {
				action : action,
				id : data.id,
				number : data.number,
				minSeats : data.minSeats,
				maxSeats : data.maxSeats
			},
			success : function(response) {
				console.log(response);

				if (response.success) {
					onSuccess(response);
				}
			}
		});
	};

	var clearAll = function() {
		form.clearForm();
		table.clearRowSelection();
		form.setAddButtonEnabled(false);
		form.setUpdateButtonEnabled(false);
		form.setDeleteButtonEnabled(false);
	}

	var onRowClick = function($row) {
		if (table.isRowSelected($row)) {
			table.clearRowSelection();
			form.clearForm();
			form.setAddButtonEnabled(false);
			form.setUpdateButtonEnabled(false);
		} else {
			var rowData = table.getRowData($row);
			table.selectRow($row);
			form.fillForm(rowData);
			form.setAddButtonEnabled(false);
			form.setUpdateButtonEnabled(false);
		}
		
		if (!table.isAvailable($row)) {
			form.showTooltip('button-update', 'Can\'t update or delete this table'
					+ ' because it belongs to at least one active booking.');
		} else {
			form.hideTooltips();
		}

		form.setDeleteButtonEnabled(canDelete($row));

		form.setNumberFieldHighlighted(false);
		form.setSeatsFieldsHighlighted(false);
	}

	var onInputChange = function() {
		var $selectedRow = table.getSelectedRow();

		/*
		 * If a row is selected, check if canEdit, else check if canAdd. Enable
		 * or disable the buttons accordingly.
		 */
		if ($selectedRow != undefined) {
			form.setUpdateButtonEnabled(canUpdate($selectedRow));
		} else {
			form.setAddButtonEnabled(canAdd());
		}

		/*
		 * Delete button is always disabled unless the form AND the selected row
		 * contain the same data.
		 */
		form.setDeleteButtonEnabled(canDelete($selectedRow));
	}

	var addTable = function() {
		sendRequest('add', getDataForRequest(), function(response) {
			table.addRow(response);
			clearAll();
		});
	}

	var updateTable = function($tableRow) {
		sendRequest('update', getDataForRequest(), function(response) {
			table.editRow(response);
			clearAll();
		});
	}

	var deleteTable = function($tableRow) {
		sendRequest('delete', getDataForRequest(), function(response) {
			table.deleteRow(response);
			clearAll();
		});
	}

	var initListeners = function() {
		$('#pizzeria-table #tables-table tbody').on('click', 'tr', function() {
			var $row = $(this);
			onRowClick($row);
		});

		$('#pizzeria-table .edit-table-form input').on('input propertychange', function() {
			onInputChange();
		});

		$('#pizzeria-table .button-add').on('click', function() {
			addTable();
		});

		$('#pizzeria-table .button-update').on('click', function() {
			var $tableRow = table.getSelectedRow();
			updateTable($tableRow);
		});

		$('#pizzeria-table .button-delete').on('click', function() {
			var $tableRow = table.getSelectedRow();
			deleteTable($tableRow);
		});
	}

	return {
		init : function() {
			table.initDataTable();
			initListeners();
		}
	}
}();