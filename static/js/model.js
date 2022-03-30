const edit_row_data = {}
$(document).ready(function(){
    document.getElementById('loader').style.display = "block";
    document.getElementById('projecttab').style.display = "none";
    get_projects(message='Loading Projects...........')
    $('[data-toggle="tooltip"]').tooltip();
    var actions = $("table td:last-child").html();
    // Append table with add proj form on add new button click
    $(".add-new").click(function(){
        $(this).attr("disabled", "disabled");
        var index = $("table tbody tr:last-child").index();
        var proj = '<tr id="newrow"><form id="newitemform">' +
            '<td style="display:none">#</td>' +
            '<td><input type="text" max-length="100" class="form-control" name="newname" id="newname" required></td>' +
            '<td><textarea max-length="1000" class="form-control" name="newdescription" rows="2" columns="15" id="newdescription" required></textarea></td>' +
            '<td><textarea max-length="200" class="form-control" name="newskills" rows="2" columns="15" id="newskills" required></textarea></td>' +
            '<td><input type="date" name="newitemsdate" id="newstartdate" class="form-control" required></td>' +
            '<td><input type="date" name="newitemedate" id="newenddate" class="form-control" required></td>' +
            '<td><a class="newadd" title="Add" data-toggle="tooltip" id="newadd"><i class="fa fa-plus"></i></a><a class="newdelete" title="Delete" id="newdelete"><i class="fa fa-trash-o"></i></a>'+
            '</td></form></tr>';
        $("table").append(proj);
        $("table tbody tr").eq(index + 1).find(".add, .edit, .delete").toggle();
        $('[data-toggle="tooltip"]').tooltip();
        document.getElementById("noproject").innerHTML = ''
        $(".edit").removeClass("edit").addClass("edit_disabled");
        $(".delete").removeClass("delete").addClass("delete_disabled");
        $('.edit_disabled').attr('title', 'Add/Delete the current item');
        $('.delete_disabled').attr('title', 'Add/Delete the current item');
    });

    // Add proj on add button click
    $(document).on("click", ".add", function(){
        console.log("Asss.....................................")
        var empty = false;
        var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function(){
            if(!$(this).val()){
                $(this).addClass("error");
                empty = true;
            } else{
                $(this).removeClass("error");
            }
        });
        var txtid = $("#txtid").val();
        var txtname = $("#txtname").val();
        var txtdescription = $("#txtdescription").val();
        $.post("/ajax_add", { txtid: txtid, txtname: txtname, txtdescription: txtdescription}, function(data) {
            $("#displaymessage").html(data);
            $("#displaymessage").show();
        });
        $(this).parents("tr").find(".error").focus();
        if(!empty){
            input.each(function(){
                $(this).parent("td").html($(this).val());
            });
            $(this).parents("tr").find(".add, .edit").toggle();
            $(".add-new").removeAttr("disabled");
        }
    });
    // Delete proj on delete button click
    $(document).on("click", ".delete", function(){
        $(this).parents("tr").remove();
        $(".add-new").removeAttr("disabled");
        var id = $(this).attr("id");
        var string = id;
        console.log("Delete ID.................", id)
        fetch("/projectdetails/api/"+id+"/", {
            method: "DELETE",
        })
        .then(response => response.json())
        .then(json => {
            document.getElementById('projecttab').disabled = true
            get_projects(message='Loading Projects...........')

        })
    });
    // update rec proj on edit button click
    $(document).on("click", ".update", function(){
        var empty = false;
        var input = $(this).parents("tr").find('input[type="text"], input[type="date"], textarea');
        input.each(function(){
            if(!$(this).val()){
                $(this).addClass("error");
                empty = true;
            } else{
                $(this).removeClass("error");
            }
        });
        $("tr input, tr textarea").prop('disabled', true);
        $(this).parents("tr").find('input[type=text]').prop('disabled', true)
        var id = $(this).attr("id");
        var string = id;
        var txtid = $("#txtid").val();
        var txtname = $("#txtname").val();
        var txtdescription = $("#txtdescription").val();
        var txtskills = $("#txtskills").val();
        var start_date = $("#estart_date").val();
        var end_date = $("#eend_date").val();
        if(txtname === '' || txtdescription === '' || txtskills === '' || start_date === '' || end_date === ''){
             $(this).parents("tr").find(".error").focus();
            $("tr input, tr textarea").prop('disabled', false);
            $(this).parents("tr").find('input[type=text]').prop('disabled', false)
            toastr.error('Please fill all the fields');
        }else{
            document.getElementById('loader').style.display = "block";
            document.getElementById('loader_message').innerHTML = 'Updating Data.......'
            fetch("/projectdetails/api/"+id+"/", {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json"
                },
                 body: JSON.stringify({ id: id, name: txtname, description: txtdescription, skills: txtskills, start_date: start_date, end_date: end_date})
            })
            .then(response => response.json())
            .then(json => {
                document.getElementById('projecttab').disabled = true
                get_projects(message='Loading Projects...........')
                $(".add-new").attr("disabled", false);
                $(".edit_disabled").removeClass("edit_disabled").addClass("edit");
                $(".delete_disabled").removeClass("delete_disabled").addClass("delete");
                $('.edit').attr('title', 'Edit');
                $('.delete').attr('title', 'Delete');
            })
        }
    });
    // Edit proj on edit button click
    $(document).on("click", ".edit", function(){
        $(this).parents("tr").find("td:not(:last-child)").each(function(i){
            if (i=='0'){
                var idname = 'txtid';
                edit_row_data['id'] = $(this).text()
            }else if (i=='1'){
                var idname = 'txtname';
                edit_row_data['name'] = $(this).text()
            }else if (i=='2'){
                var idname = 'txtdescription';
                edit_row_data['description'] = $(this).text()
            }else if (i=='3'){
                var idname = 'txtskills';
                edit_row_data['skills'] = $(this).text()
            }else if (i=='4'){
                var idname = 'estart_date';
                edit_row_data['start_date'] = $(this).text()
            }else if (i=='5'){
                var idname = 'eend_date';
                edit_row_data['end_date'] = $(this).text()
            }else{}
            if(i==1){
                $(this).html('<input type="text" max-length="100" name="updaterec" id="' + idname + '" class="form-control" value="' + $(this).text() + '" required>');
            }else if(i==2){
                $(this).html('<textarea max-length="1000" name="updaterec" id="' + idname + '" class="form-control" required>'+$(this).text() +'</textarea>');
            }else if(i==3){
                $(this).html('<textarea max-length="200" name="updaterec" id="' + idname + '" class="form-control" required>'+$(this).text() +'</textarea>');
            }else if(i==4 || i==5){
                $(this).html('<input type="date" name="updaterec" id="' + idname + '" class="form-control" value="' + $(this).text() + '" required>');
            }
        });
        $(this).parents("tr").find(".save, .edit").toggle();
        $(this).parents("tr").find(".delete, .cancel").toggle();
        $(".edit").removeClass("edit").addClass("edit_disabled");
        $(".delete").removeClass("delete").addClass("delete_disabled");
        $('.edit_disabled').attr('title', 'Save/Cancel the current item to enable this');
        $('.delete_disabled').attr('title', 'Save/Cancel the current item to enable this');
        $(".add-new").attr("disabled", "disabled");
        $(this).parents("tr").find(".save").removeClass("save").addClass("update");
    });
    //Delete the newly temp item
    $(document).on("click", ".newdelete", function(){
        $(this).parents("tr").remove();
        $("#newrow").remove();
        $(".add-new").removeAttr("disabled");
        $(".edit_disabled").removeClass("edit_disabled").addClass("edit");
        $(".delete_disabled").removeClass("delete_disabled").addClass("delete");
        $('.edit').attr('title', 'Edit');
        $('.delete').attr('title', 'Delete');
    });

    $(document).on("click", ".newadd", function(){
        var empty1 = false;
        var inputerror = $(this).parents("tr").find('input[type="text"], input[type="date"], textarea');
        inputerror.each(function(){
            if(!$(this).val()){
                $(this).addClass("error");
                empty1 = true;
            } else{
                $(this).removeClass("error");
            }
        });
        if($('#newname').val() === '' || $('#newdescription').val() === '' || $('#newskills').val() === '' ||  $('#newstartdate').val() === '' || $('#newenddate').val() === ''){
            $(this).parents("tr").find(".error").focus();
            toastr.error('Please fill all the fields');
        }else{
            fetch("/projectdetails/api/", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                 body: JSON.stringify({name: $('#newname').val(), description: $('#newdescription').val(), skills: $('#newskills').val(),  start_date: $('#newstartdate').val(), end_date: $('#newenddate').val()})
            })
            .then(response => response.json())
            .then(json => {
                document.getElementById('projecttab').disabled = true
                get_projects(message='Adding Projects...........')
                $(".add-new").attr("disabled", false);
            })
        }
    });

    $(document).on("click", ".cancel", function(){
        $(this).parents("tr").find("td:not(:last-child)").each(function(i){
            if(i==0){
                $(this).html(edit_row_data['id']);
            }else if(i==1){
                 $(this).html(edit_row_data['name'])
            }else if(i==2){
                $(this).html(edit_row_data['description']);
            }else if(i==3){
                $(this).html(edit_row_data['description']);
            }else if(i==4){
                 $(this).html(edit_row_data['start_date'])
            }else if(i==5){
                $(this).html(edit_row_data['end_date'])
            }
            $(".add-new").removeAttr("disabled");
//            $(this).parents("tr").find(".Edit, .update").toggle();
//            $(this).parents("tr").find(".cancel, .delete").toggle();
            $(this).parents("tr").find(".delete, .edit").css('display','inline-block')
            $(this).parents("tr").find(".save, .cancel").css('display','None')
            $(this).parents("tr").find(".update").removeClass("update").addClass("save");
            $(".edit_disabled").removeClass("edit_disabled").addClass("edit");
            $(".delete_disabled").removeClass("delete_disabled").addClass("delete");
            $('.save').css("display", "none");
            $('.edit').attr('title', 'Edit');
            $('.delete').attr('title', 'Delete');
            $(this).parents("tr").find(".update").removeClass("update").addClass("save");
            $('#save').css("display", "none");
            this.edit_row_data = {}
        });

    });
});
function get_projects(message='') {
    document.getElementById('loader').style.display = "block";
    if(message != ''){
        document.getElementById('loader_message').innerHTML = message
    }
    fetch("/projectdetails/api/")
    // Converting received data to JSON
    .then(response => response.json())
    .then(json => {
        var tdata = ''
        var tdata = '<thead><tr><th width="1px" style="display:none">#</th><th width="20px">Name</th><th width="40px">Description</th><th width="30px">Skills</th><th width="15px">Start Date</th><th width="15px">End Date</th><th width="5px">Actions</th></tr></thead><tbody>'
        // Create a variable to store HTML
        if(json && json.data &&  json.data.length > 0){
            for(var pdata of json.data){
                tdata += '<tr><td width="1px" style="display:none">'+pdata.id+'</td><td>'+pdata.name+'</td><td>'+pdata.description+'</td><td>'+pdata.skills+'</td><td>'+pdata.start_date+'</td><td>'+pdata.end_date+'</td>'
                tdata +='<td><a class="save" title="update" data-toggle="tooltip" id="'+pdata.id +'"><i class="fa fa-save"></i></a><a class="edit" data-toggle="tooltip" id="'+pdata.id+'"><i class="fa fa-pencil"></i></a><a class="delete" data-toggle="tooltip" id="'+pdata.id+'"><i class="fa fa-trash-o"></i></a><a class="cancel" title="cancel" data-toggle="tooltip" id="'+pdata.id+'"><i color="red" class="fa fa-close"></i></a></td>'
            }
            tdata += '</tbody>'
            document.getElementById("projects_table").innerHTML = tdata
            document.getElementById('projecttab').style.display = "block";
            document.getElementById('loader').style.display = "none";
            document.getElementById('projecttab').disabled = false;
        }else{
            document.getElementById("projects_table").innerHTML = tdata
            document.getElementById("noproject").innerHTML = '<h1>No Projects Exist</h1>'
            document.getElementById('projecttab').style.display = "block";
            document.getElementById('loader').style.display = "none";
//            document.getElementById('projecttab').disabled = false;
        }
    });
}