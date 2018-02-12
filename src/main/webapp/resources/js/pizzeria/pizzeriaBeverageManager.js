pizzeriaBeverageManager = function() {
	var table = function() {
		var $dataTable;

		var getRowById = function(id) {
			var $rows = $dataTable.$('tr');

			for (var i = 0; i < $rows.length; i++) {
				var $row = $rows.eq(i);
				var rowData = $dataTable.row($row).data();
				if (rowData.id == id) {
					return $row;
				}
			}
		};

		return {
			selectRow : function($row) {
				var $beveragesTable = $row.closest('#beverage-manager #beverages-table');
				$beveragesTable.find('.selected').removeClass('selected');
				$row.addClass('selected');
			},

			clearRowSelection : function() {
				$('#beverage-manager #beverages-table tr.selected').removeClass('selected');
			},

			addRow : function(rowData) {
				$dataTable.row.add(rowData).draw();
			},

			editRow : function(rowData) {
				var $row = getRowById(rowData.id);

				if ($row != undefined) {
					$dataTable.row($row).data(rowData).draw();
				}
			},

			deleteRow : function(rowData) {
				var $row = getRowById(rowData.id);

				if ($row != undefined) {
					$dataTable.row($row).remove().draw();
				}
			},

			getSelectedRow : function() {
				var $selectedRow = $('#beverage-manager #beverages-table tr.selected');

				/*
				 * This method returns undefined to be consistent with the other
				 * getRow methods.
				 */
				if ($selectedRow.length > 0) {
					return $selectedRow;
				}
			},

			getRowData : function($row) {
				return $dataTable.row($row).data();
			},

			isRowSelected : function($row) {
				return $row.hasClass('selected');
			},

			hasOrderItems : function($row) {
				return $dataTable.row($row).data().orderItems > 0;
			},

			initDataTable : function() {
				$dataTable = $("#beverages-table").DataTable({
					paging : false,
					searching : false,
					ajax : {
						url : "/pizzeria/beveragesList",
						dataSrc : '',
					},
					columns : [ {
						'data' : 'name'
					}, {
						'data' : 'brand'
					}, {
						'data' : 'container'
					}, {
						'data' : 'size'
					}, {
						'data' : 'type'
					}, {
						'data' : 'price'
					} ],

					createdRow : function(row, data, index) {
						if (data.orderItems > 0) {
							$(row).addClass('highlighted');
						}
					}
				});
			}
		};
	}();

	var form = function() {
		var $beverageSelect;

		return {
			setButtonEnabled : function(buttonClass, enabled) {
				if (enabled) {
					$('#beverage-manager .' + buttonClass).removeAttr('disabled');
				} else {
					$('#beverage-manager .' + buttonClass).attr('disabled', 'disabled');
				}
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
				$('#beverage-manager button').tooltip('hide');
			},

			clearForm : function() {
				$('#beverage-manager .edit-beverage-form input').val(null);
				$beverageSelect.val(null).trigger('change');
			},

			fillForm : function(rowData) {
				$beverageSelect.val(rowData.beverageId).trigger('change');
				$('#beverage-manager #beverage-price').val(rowData.price.toFixed(2));
			},

			isFilled : function() {
				return $beverageSelect.val().length > 0
						&& $('#beverage-manager #beverage-price').val().length > 0;
			},

			getFormData : function() {
				return {
					beverageId : parseInt($beverageSelect.val()),
					price : parseFloat($('#beverage-manager #beverage-price').val())
				}
			},

			setChangeListener : function(onChange) {
				$beverageSelect.on('change', function() {
					onChange();
				});

				$('#beverage-manager .edit-beverage-form input').on('input propertychange',
						function() {
							onChange();
						});
			},

			initForm : function() {
				$beverageSelect = $('.edit-beverage-form #beverage').select2({
					placeholder : 'Select beverage'
				});
			}
		};
	}();

	var clearAll = function() {
		form.clearForm();
		table.clearRowSelection();
		form.setButtonEnabled('button-add', false);
		form.setButtonEnabled('button-update', false);
		form.setButtonEnabled('button-delete', false);
	}

	var canAdd = function() {
		/* Check if all the form fields are filled. */
		if (!form.isFilled()) {
			return false;
		}

		/* TODO - Check if the user is trying to add a row which already exists. */

		return true;
	};

	var canUpdate = function($row) {
		/* Check if all the form fields are filled. */
		if (!form.isFilled()) {
			return false;
		}

		/* Check if form data is equal to the selected row data. */
		if (formDataEqualsSelectedRowData()) {
			return false;
		}

		/*
		 * Check if, according to the data received by the server, the beverage
		 * is contained in an OrderItem.
		 */
		if (table.hasOrderItems($row)) {
			return false;
		}

		/*
		 * TODO - Check if the data the user is trying to insert isn't already
		 * in another row.
		 */

		return true;
	};

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
		 * Check if, according to the data received by the server, the beverage
		 * is contained in an OrderItem.
		 */
		if (table.hasOrderItems($row)) {
			return false;
		}

		return true;
	}

	/**
	 * Returns true if the data present in the form is equal to the data saved
	 * in the selected row.
	 */
	var formDataEqualsSelectedRowData = function() {
		var formData = form.getFormData();
		var $selectedRow = table.getSelectedRow();

		if ($selectedRow != undefined) {
			var rowData = table.getRowData($selectedRow);
			return formData.beverageId == rowData.beverageId && formData.price == rowData.price;
		}

		return false;
	};

	var getDataForRequest = function() {
		var id;
		var $selectedRow = table.getSelectedRow();

		if ($selectedRow != undefined) {
			id = table.getRowData($selectedRow).id;
		} else {
			id = -1;
		}

		var formData = form.getFormData();
		formData.id = id;

		return formData;
	}

	var sendRequest = function(action, data, onSuccess) {
		data.action = action;

		$.ajax({
			method : 'post',
			url : '/pizzeria/beverages',
			dataType : 'json',
			data : data,
			success : function(response) {
				console.log(response);

				if (response.success) {
					/* This isn't needed anymore. */
					delete response.success;
					onSuccess(response);
				}
			}
		});
	};

	var addBeverage = function() {
		sendRequest('add', getDataForRequest(), function(data) {
			table.addRow(data);
			clearAll();
		});
	};

	var updateBeverage = function() {
		sendRequest('update', getDataForRequest(), function(data) {
			table.editRow(data);
			clearAll();
		});
	}

	var deleteBeverage = function() {
		sendRequest('delete', getDataForRequest(), function(data) {
			table.deleteRow(data);
			clearAll();
		});
	}

	var onRowClick = function($row) {
		if (table.isRowSelected($row)) {
			table.clearRowSelection();
			form.clearForm();
			form.setButtonEnabled('button-add', false);
			form.setButtonEnabled('button-update', false);
			form.hideTooltips();
		} else {
			var rowData = table.getRowData($row);
			table.selectRow($row);
			form.fillForm(rowData);
			form.setButtonEnabled('button-add', false);
			form.setButtonEnabled('button-update', false);

			if (table.hasOrderItems($row)) {
				form.showTooltip('button-update', 'Can\'t update or delete this beverage'
						+ ' because it belongs to at least one active booking.');
			} else {
				form.hideTooltips();
			}
		}

		form.setButtonEnabled('button-delete', canDelete($row));
	}

	var onFormChange = function() {
		var $selectedRow = table.getSelectedRow();

		/*
		 * If a row is selected, check if canUpdate, else check if canAdd.
		 * Enable or disable the buttons accordingly.
		 */
		if ($selectedRow != undefined) {
			form.setButtonEnabled('button-update', canUpdate($selectedRow));
		} else {
			form.setButtonEnabled('button-add', canAdd());
		}

		/*
		 * Delete button is always disabled unless the form AND the selected row
		 * contain the same data.
		 */
		form.setButtonEnabled('button-delete', canDelete($selectedRow));
	}

	var initListeners = function() {
		$('#beverage-manager #beverages-table tbody').on('click', 'tr', function() {
			var $row = $(this);
			onRowClick($row);
		});

		form.setChangeListener(onFormChange);

		$('#beverage-manager .button-add').on('click', function() {
			addBeverage();
		});

		$('#beverage-manager .button-update').on('click', function() {
			updateBeverage();
		});

		$('#beverage-manager .button-delete').on('click', function() {
			deleteBeverage();
		});
	};

	return {
		init : function() {
			table.initDataTable();
			form.initForm();
			initListeners();
		}
	};
}();