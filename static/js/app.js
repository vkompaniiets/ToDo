$(document).ready(function() {
	/*************** Globals ***************/
	var routing = {
		editTask: 'edit_task/',
		deleteTask: 'delete/',
		createTask: 'create/',
		markDoneTask: 'mark_done/',
		getLastId: 'get_last_id/'
	};

	/*************** AJAX ***************/
	var sendPostQuery = function(url, data) {
		return $.ajax({
		    headers: { "X-CSRFToken": jQuery("[name=csrfmiddlewaretoken]").val() },
  			type: "POST",
  			url: url,
  			data: data,
  			dataType: 'json'
		});
	}

	var sendGetQuery = function(url) {
		return $.ajax({
  			type: "GET",
  			url: url,
  			dataType: 'json'
		});
	}

	/*************** Notification ***************/
	var showNotification = function(type, text) {
		$.notify({
        	message: text
        },
        {
            type: type,
            timer: 1000,
            placement: {
                from: 'top',
                align: 'right'
            }
        });
	}

    /*************** Delete task ***************/
    $(document).on('click', 'button[id^="delete"]', function(event) {
        event.preventDefault();
        var task_id = this.name;
        var answer = sendPostQuery(routing.deleteTask, {
            'task_id': task_id
        });
        // update DOM -> delete div with this id
        $('#entry-' + task_id).remove();
        answer.success(function(data) {
			if (data['status'] == 'success') {
				showNotification('success', 'Task deleted!');
			} else {
				showNotification('danger', 'Error!');
			}
		});

		answer.error(function(data) {
            console.log(data);
        });
    });


    /*************** Mark task ***************/
    $(document).on('click', 'input[id^="is_done"]', function() {
        var task_id = this.name;
        var is_done = 'False';
        if (this.checked) {
            is_done = 'True'
        }
        var answer = sendPostQuery(routing.markDoneTask, {
            'task_id': task_id,
            'is_done': is_done
        });

        answer.success(function(data) {
			if (data['status'] == 'success') {
				showNotification('success', 'Task is marked!');
			} else {
				showNotification('danger', 'Error!');
			}
		});

		answer.error(function(data) {
            console.log(data);
        });
    });

    /*************** Edit task ***************/
    $(document).on('click', 'button[id^="update"]', function() {
        event.preventDefault();
        $('#update' + this.name).hide();
        $('#task_save' + this.name).show(100);
        $('#task_cancel' + this.name).show(100)
        $('#task_name' + this.name).prop('readonly', false);
    });

    $(document).on('click', 'button[id^="task_cancel"]', function() {
        event.preventDefault();
        $('#update' + this.name).show(100);
        $('#task_save' + this.name).hide();
        $('#task_cancel' + this.name).hide()
        $('#task_name' + this.name).prop('readonly', true);
    });

    $(document).on('click', 'button[id^="task_save"]', function() {
        event.preventDefault();

        var task_id = this.name;
        var name = $('#task_name' + task_id).val();;

        var answer = sendPostQuery(routing.editTask, {
            'task_id': task_id,
            'name': name
        });

        answer.success(function(data) {
			if (data['status'] == 'success') {
                $('#update' + task_id).show(100);
                $('#task_save' + task_id).hide();
                $('#task_cancel' + task_id).hide()
			    $('#task_name' + task_id).prop('readonly', true);
				showNotification('success', 'Task name changed!');
			} else {
				showNotification('danger', data['error']);
			}
		});

		answer.error(function(data) {
            console.log(data);
        });
    });

    /*************** New task ***************/
    $('#new_task').click(function(event) {
        event.preventDefault();
        $('#new_task').hide();
        $('#save_task').show(500);
        $('#cancel').show(500);
        $('#task_list').append(newBlock());
    });

    function newBlock() {
        var id = last_id + 1;
        var block = `
            <div class="panel panel-default" style="padding:15px" id="entry-` + id + `">
                <div class="input-group col-sm-12">
                    <span class="input-group-addon">
                        <input id="is_done` + id + `" type="checkbox" name="` + id + `" disabled>
                    </span>
                    <input id="task_name` + id + `" name="` + id + `" type="text" class="form-control" value="">
                    <div class="input-group-btn">
                        <button id="update` + id + `" name="` + id + `" type="button" class="btn btn-default" disabled>
                            <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                        </button>
                        <button style="display:none;" id="task_save` + id + `" name="` + id + `" type="button" class="btn btn-default" disabled>
                            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                        </button>
                        <button style="display:none;" id="task_cancel` + id + `" name="` + id + `" type="button" class="btn btn-default" disabled>
                            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </button>
                        <button id="delete` + id + `" name="` + id + `" type="button" class="btn btn-default" disabled>
                            <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </div>`;
        return block;
    }

    $('#save_task').click(function(event) {
        event.preventDefault();

        var id = last_id + 1;
        var name = $('#task_name' + id).val();
        var answer = sendPostQuery(routing.createTask, {
            'name': name
        });

        answer.success(function(data) {
			if (data['status'] == 'success') {
                $('#new_task').show(500);
                $('#save_task').hide();
                $('#cancel').hide();
				showNotification('success', 'New task saved!');
				last_id += 1;

				$('#is_done' + last_id).prop('disabled', false);
				$('#task_name' + last_id).prop('readonly', true);
				$('#task_save' + last_id).prop("disabled", false);
				$('#task_cancel' + last_id).prop("disabled", false);
				$('#update' + last_id).prop("disabled", false);
				$('#delete' + last_id).prop("disabled", false);
			} else {
				showNotification('danger', data['error']);
			}
		});

		answer.error(function(data) {
            console.log(data);
        });
    });

    $('#cancel').click(function(event) {
        event.preventDefault();
        $('#new_task').show(500);
        $('#save_task').hide();
        $('#cancel').hide();

        // update DOM -> delete div with this id
        $('#entry-' + (last_id + 1)).remove();
    });

    function getLastId() {
        var answer = sendGetQuery(routing.getLastId);
        answer.success(function(data) {
			last_id = data['last_id'];
		});

		answer.error(function(data) {
            console.log(data);
        });
    }

    getLastId();
    var last_id = 0;
});