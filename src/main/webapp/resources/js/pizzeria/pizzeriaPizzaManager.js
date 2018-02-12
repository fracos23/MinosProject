pizzeriaPizzaManager = function() {
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
				var $pizzasTable = $row.closest('#pizza-manager #pizzas-table');
				$pizzasTable.find('.selected').removeClass('selected');
				$row.addClass('selected');
			},

			clearRowSelection : function() {
				$('#pizza-manager #pizzas-table tr.selected').removeClass('selected');
			},

			addRow : function(rowData) {
				console.log('addRow');
				console.log(rowData);
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
				var $selectedRow = $('#pizza-manager #pizzas-table tr.selected');

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
				$dataTable = $("#pizzas-table").DataTable({
					paging : false,
					searching : false,
					ajax : {
						url : "/pizzeria/pizzasList",
						dataSrc : '',
					},
					columns : [ {
						'data' : 'pizzaName'
					}, {
						'data' : 'size'
					}, {
						'data' : 'preparationTime'
					}, {
						'data' : 'glutenFree'
					}, {
						'data' : 'price'
					} ],

					createdRow : function(row, data, index) {
						if (data.orderItems > 0) {
							$(row).addClass('highlighted');
						}
					},

					columnDefs : [ {
						/*
						 * Turns the PizzaSize value all lowercase, then changes
						 * only the first letter to uppercase.
						 */
						render : function(data, type, row) {
							return data.toLowerCase().replace(/\b\w/g, function(m) {
								return m.toUpperCase();
							});
						},
						targets : 1
					}, {
						/* Shows glutenFree as 'Yes' or 'No. */
						render : function(data, type, row) {
							return data ? 'Yes' : 'No';
						},
						targets : 3
					}, {
						/* Formats price with 2 decimal places. */
						render : function(data, type, row) {
							return "&euro; " + data.toFixed(2);
						},
						targets : 4
					} ]
				});
			}
		};
	}();

	var form = function() {
		var $pizzaSelect;
		var $sizeSelect;
		var $preparationTimePicker;

		return {
			setButtonEnabled : function(buttonClass, enabled) {
				if (enabled) {
					$('#pizza-manager .' + buttonClass).removeAttr('disabled');
				} else {
					$('#pizza-manager .' + buttonClass).attr('disabled', 'disabled');
				}
			},

			clearForm : function() {
				$('#pizza-manager .edit-pizza-form input').val(null);
				$pizzaSelect.val(null).trigger('change');
				$sizeSelect.val(null).trigger('change');
			},

			fillForm : function(rowData) {
				$pizzaSelect.val(rowData.pizzaId).trigger('change');
				$sizeSelect.val(rowData.size).trigger('change');
				$('#pizza-manager #pizza-preparation-time').val(rowData.preparationTime);
				$('#pizza-manager #pizza-gluten-free').prop('checked', rowData.glutenFree);
				$('#pizza-manager #pizza-price').val(rowData.price.toFixed(2));
			},

			isFilled : function() {
				return $pizzaSelect.val().length > 0 && $sizeSelect.val().length > 0
						&& $('#pizza-manager #pizza-preparation-time').val().length > 0
						&& $('#pizza-manager #pizza-price').val().length > 0;
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
				$('#pizza-manager button').tooltip('hide');
			},

			getFormData : function() {
				return {
					pizzaId : parseInt($pizzaSelect.val()),
					size : $sizeSelect.val(),
					preparationTime : $('#pizza-manager #pizza-preparation-time').val(),
					glutenFree : $('#pizza-manager #pizza-gluten-free').prop('checked'),
					price : parseFloat($('#pizza-manager #pizza-price').val())
				}
			},

			setChangeListener : function(onChange) {
				$pizzaSelect.on('change', function() {
					onChange();
				});

				$sizeSelect.on('change', function() {
					onChange();
				});

				$preparationTimePicker.on('dp.change', function() {
					onChange();
				});

				$('#pizza-manager .edit-pizza-form input').on('input propertychange', function() {
					onChange();
				});

				$('#pizza-manager .edit-pizza-form #pizza-gluten-free').on('change', function() {
					onChange();
				});
			},

			initForm : function() {
				$pizzaSelect = $('.edit-pizza-form #pizza').select2({
					placeholder : "Select a pizza",
				});

				$sizeSelect = $('.edit-pizza-form #pizza-size').select2({
					placeholder : 'Select a size'
				});

				$preparationTimePicker = $('.edit-pizza-form #pizza-preparation-timepicker')
						.datetimepicker({
							format : 'mm:ss',
							useCurrent : false,
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
			return formData.pizzaId == rowData.pizzaId && formData.size == rowData.size
					&& formData.preparationTime == rowData.preparationTime
					&& formData.glutenFree == rowData.glutenFree && formData.price == rowData.price;
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
			url : '/pizzeria/pizza',
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

	var addPizza = function() {
		sendRequest('add', getDataForRequest(), function(data) {
			table.addRow(data);
			clearAll();
		});
	};

	var updatePizza = function() {
		sendRequest('update', getDataForRequest(), function(data) {
			table.editRow(data);
			clearAll();
		});
	}

	var deletePizza = function() {
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
				form.showTooltip('button-update', 'Can\'t update or delete this pizza'
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
		$('#pizza-manager #pizzas-table tbody').on('click', 'tr', function() {
			var $row = $(this);
			onRowClick($row);
		});

		form.setChangeListener(onFormChange);

		$('#pizza-manager .button-add').on('click', function() {
			addPizza();
		});

		$('#pizza-manager .button-update').on('click', function() {
			updatePizza();
		});

		$('#pizza-manager .button-delete').on('click', function() {
			deletePizza();
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