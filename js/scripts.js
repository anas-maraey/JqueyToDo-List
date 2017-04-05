  var db = openDatabase("html5-assignment","1.0","todolist assignment",1*1024*1024);
//users Object
  var users = {
    "createTable" : function (){
      db.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS users (name,email unique,password)');
      })
    },
    "dropTable" : function (){
      db.transaction(function(tx){
        tx.executeSql('DROP TABLE users');
      })
    },
    "checkForLoggedInUser" : function(){
      var userId=localStorage.getItem("userId");
      if(!userId){
          return false;
      }else{
        return true;
      }
    },
    "insertUser" : function(userData){
      db.transaction(function(tx){
        tx.executeSql("INSERT INTO users VALUES (?,?,?)",[userData['name'],userData['email'],userData['password']]);
      })
    },
    "authenticate" : function(email,password){
      console.log("hello from auth",email,password);
      return new Promise(function(resolve, reject) {
          db.transaction(function(tx){
            tx.executeSql("SELECT rowid , * FROM users WHERE email=? AND password=?",[email,password],function(tx,res){
              if (res) {
                if (!res.rows.length) {
                  console.log("No USERS from no length");
                  resolve({status:'error',message:'there is no users!'})
                }else{
                  // console.log("founduser",res.rows.length);
                  resolve({status:'success',data:res.rows});
                }
              }else {
                console.log("7aga zy l zft");
                reject("an error has been occured")
              }
            })
          })
      });
    },
    "login" : function(userId){
      localStorage.setItem("userId", userId);
      location.reload();
    },
    "selectUserData" : function(userId){
      return new Promise(function(resolve, reject) {
          db.transaction(function(tx){
            tx.executeSql("SELECT * FROM users WHERE rowid=?",[userId],function(tx,res){
              if (res) {
                if (!res.rows.length) {
                  resolve({status:'error',message:'there is no users!'})
                }else{
                  resolve({status:'success',data:res.rows});
                }
              }else {
                reject("an error has been occured")
              }
            })
          })
      });
    },
  };

//tasks Object
  var tasks = {
    "createTable" : function (){
      db.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS tasks(task,description,state,date,userId,FOREIGN KEY (userId) REFERENCES users(rowid))');
      })
    },
    "dropTable" : function (){
      db.transaction(function(tx){
        tx.executeSql('DROP TABLE users');
      })
    },
    "insertTask" : function(task,userId){
      return new Promise(function(resolve, reject){
        db.transaction(function(tx){
            tx.executeSql("INSERT INTO tasks VALUES (?,?,?,?,?)",[task['task'],task['description'],task['state'],Date(),userId],function(tx,res){
              console.log(res);
              if (res) {
                if (!res.rows.length) {
                  resolve({status:'error',message:'there is no users!'})
                }else{
                  console.log(res.rows);
                  resolve({status:'success',data:res.rows});
                }
              }else {
                reject("an error has been occured")
              }
            })
          })
      });
    },
    "deleteTask" : function(task){
        db.transaction(function(tx){
          tx.executeSql("DELETE FROM tasks WHERE task = ?",[task]);
        })
        location.reload();
      },
    "updateTask" : function(task , taskName){
      db.transaction(function(tx){
        tx.executeSql("UPDATE tasks SET task = ? , description = ? , state =? WHERE task = ?",[task[0],task[1],task[2],taskName]);
      })
      location.reload();
    },
    "updateTaskData" : function(task , taskId){
      return new Promise(function(resolve, reject) {
          db.transaction(function(tx){
            tx.executeSql("UPDATE tasks SET task = ? , description = ? , state =? WHERE rowid =?",[task['updatedTask'],task['updatedDescription'],task['updatedState'],taskId],function(tx,res){
              if (res) {
                if (!res.rows.length) {
                  resolve({status:'error',message:'there is no users!'})
                }else{
                  resolve({status:'success',data:res.rows});
                }
              }else {
                reject("an error has been occured")
              }
            })
          })
      });
    },
    "updateTaskState1" : function(taskId){
      db.transaction(function(tx){
        tx.executeSql("UPDATE tasks SET state ='true' WHERE rowid = ?",[taskId]);
      })
    },
    "updateTaskState2" : function(taskId){
      db.transaction(function(tx){
        tx.executeSql("UPDATE tasks SET state ='false' WHERE rowid = ?",[taskId]);
      })
    },
    "getAllTasks" : function(){
      return new Promise(function(resolve, reject) {
          db.transaction(function(tx){
            tx.executeSql("SELECT rowid,* FROM tasks",[],function(tx,res){
              console.log(res);
              if (res) {
                if (!res.rows.length) {
                  resolve({status:'error',message:'there is no users!'})
                }else{
                  resolve({status:'success',data:res.rows});
                }
              }else {
                reject("an error has been occured")
              }
            })
          })
      });
    },
    "renderAllTasks" : function(tasks){
      if(tasks){
        for (var i = 0; i < tasks.length; i++) {
          console.log(tasks[i].task);
          if(tasks[i].state == 'false'){
            // var date = new Date(tasks[i].date.)
            $('.notcomp').append("<div class='notcomptodo' id=\""+tasks[i].rowid+"\" draggable=\"true\" ondragstart=\"dragstart(event)\" >\
              <p>"+tasks[i].task+"</p>\
              <p>"+tasks[i].description+"</p>\
              <p>"+tasks[i].date+"</p>\
                <button class='btn btn-danger delete' data-id="+tasks[i].task+">delete</button>\
                <button class='btn btn-success update' id=\""+tasks[i].rowid+"\">update</button>\
              </div>");
          }else if (tasks[i].state == 'true') {
            $('.comp').append("<div class='comptodo' id=\""+tasks[i].rowid+"\" draggable=\"true\" ondragstart=\"dragstart(event)\" >\
              <p>"+tasks[i].task+"</p>\
              <p>"+tasks[i].date+"</p>\
              <p>"+tasks[i].description+"</p>\
              <button class='btn btn-danger delete' data-id="+tasks[i].task+">delete</button>\
              <button class='btn btn-success update' id=\""+tasks[i].rowid+"\">update</button>\
              </div>");
          }
        }
      }
    },
  };



$(document).ready(function(){
  userData = {"name":'anas',"email":'anas.a.marrey@outlook.com',"password":'1234'};
//   console.log(userData);
  users.insertUser(userData);
  users.createTable();
  tasks.createTable();


//authenticate
$('body').on('click','#login',function(e){
  //e.preventDefault();
  var email = $("#email").val();
  var password = $("#password").val();
  // console.log(email);
  // console.log(password);
  users.authenticate(email,password).then(function(res){
    // resolve
    console.log("Hello from resolve ",typeof(res.data[0].rowid));
    users.login(res.data[0].rowid);
  },function(err){
    // reject
      $('.alert').append("<div class=\"alert alert-danger\" role=\"alert\">You Are Not Authorized</div>");
    console.log("hello from reject");
    console.log(err);
  })
});

  // Determining Which View to Display
  if(!users.checkForLoggedInUser()){
    $('body').append("<div class=\"container login-view\">\
                                <div class=\"jumbotron\">\
                                  <h1 class=\"text-center\"><strong>TODO List</strong></h1>\
                                  <form class=\"form-horizontal login\">\
                                    <div class=\"form-group\">\
                                      <label for=\"email\" class=\"col-sm-2 control-label\">E-Mail</label>\
                                      <div class=\"col-sm-10\">\
                                        <input type=\"email\" class=\"form-control\" name=\"email\" id=\"email\" placeholder=\"E-Mail\">\
                                      </div>\
                                    </div>\
                                    <div class=\"form-group\">\
                                      <label for=\"password\" class=\"col-sm-2 control-label\">Password</label>\
                                      <div class=\"col-sm-10\">\
                                        <input type=\"password\" class=\"form-control\" name=\"password\" id=\"password\" placeholder=\"Password\">\
                                      </div>\
                                    </div>\
                                    <div class=\"form-group\">\
                                      <div class=\"col-sm-offset-2 col-sm-10\">\
                                        <button type=\"submit\" id=\"login\" class=\"btn btn-success btn-block\">Login </button>\
                                      </div>\
                                    </div>\
                                  </form>\
                                </div>\
                              </div>");
  }else{
    // Retreiving User Data
    var userId=localStorage.getItem("userId");
    userId = parseInt(userId);
    users.selectUserData(userId).then(function(res){
      // resolve
      var userName = res.data[0].name;
      localStorage.setItem("userName", userName);
    },function(err){
      // reject
      console.log(err);
    })
    var userName=localStorage.getItem("userName");
    $('body').append("<div class=\"container\" >\
                        <div class=\"row\" >\
                          <button type=\"button\" class=\"addTodo\" name=\"button\">Add Todo</button>\
                          <div class=\"btn-group\">\
                            <button class=\"btn btn-default btn-lg dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\
                              "+userName+"<span class=\"caret\"></span>\
                            </button>\
                            <ul class=\"dropdown-menu\">\
                              <li><a class=\"btn logout\" name=\"button\">Log Out</a></li>\
                            </ul>\
                          </div>\
                        </div>\
                      </div>\
                      <div class=\"container tasks-view\">\
                          <div class=\"row\">\
                            <div class=\"col-md-12\">\
                              <div class=\"panel panel-success\">\
                                <div class=\"panel-heading\">\
                                  <h3 class=\"panel-title\"><center>Completed Tasks</center></h3>\
                                </div>\
                                <div class=\"panel-body comp\" ondragover=\"dragover(event)\" ondrop=\"dropcomp(event)\">\
                                </div>\
                              </div>\
                            </div>\
                          </div>\
                          <div class=\"row\">\
                            <div class=\"col-md-12\">\
                              <div class=\"panel panel-danger\">\
                                <div class=\"panel-heading\">\
                                  <h3 class=\"panel-title\"><center>Not Completed Tasks</center></h3>\
                                </div>\
                                <div class=\"panel-body notcomp\" ondragover=\"dragover(event)\" ondrop=\"dropnotcomp(event)\">\
                                </div>\
                              </div>\
                            </div>\
                          </div>\
                          <div class=\"popUp\" >\
                            <form class=\"addTask\">\
                              <input type=\"text\" name=\"task\" placeholder=\"Title\">\
                              <input type=\"text\" name=\"description\" placeholder=\"Description\">\
                              <p>State</p>\
                              <label >Completed</label><input type=\"checkbox\" name=\"state\" value=\"true\">\
                              <label >Not Completed</label><input type=\"checkbox\" name=\"state\" value=\"false\" >\
                              <button  name=\"button\">SUBMIT</button>\
                              <button type=\"button\" class=\"btn btn-danger cancel\" >Cancel</button>\
                            </form>\
                          </div>\
                          <div class=\"editpopUp\" >\
                            <form class=\"editTask\">\
                              <input type=\"text\" name=\"updatedTask\" placeholder=\"Title\">\
                              <input type=\"text\" name=\"updatedDescription\" placeholder=\"Description\">\
                              <p>State</p>\
                              <label >Completed</label><input type=\"checkbox\" name=\"updatedState\" value=\"true\">\
                              <label >Not Completed</label><input type=\"checkbox\" name=\"updatedState\" value=\"false\" >\
                              <button >SUBMIT</button>\
                              <button type=\"button\" class=\"btn btn-danger cancelUpdate\" >Cancel</button>\
                            </form>\
                          </div>\
                        </div>");
  }


    //Log Out
    $('body').on('click','.logout',function(){
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      location.reload();
    })

  //Selecting and Displaying Tasks
  tasks.getAllTasks().then(function(res){
    // resolve
    console.log(res.data);
    tasks.renderAllTasks(res.data)
  },function(err){
    // reject
    console.log(err);
  })

  //Add new Task button
  $('body').on('click','.addTodo',function(){
    $(".popUp").slideDown();
  })


  // Add New Task
  $('.addTask').submit(function(e){
    e.preventDefault();
    console.log('submitted');
    var formData = $("form").serializeArray();
    console.log("new task details",formData);
    var task = {};
    var userId=localStorage.getItem("userId");
    userId = parseInt(userId);
    for(var i =0 ; i < formData.length ; i++){
      console.log(formData[i].value);
      task[formData[i].name] = formData[i].value;
    }
    console.log("task data",task);
    tasks.insertTask(task,userId).then(function(res){
      // resolve
      console.log(res.data);
      location.reload();
    },function(err){
      // reject
      console.log(err);
    })

  });

  $('body').on('click','.cancel',function(){
    $(".popUp").slideUp();
  })

  //Update Task
  $('body').on('click','.update',function(e){
    var taskId = $(this).attr('id');
    localStorage.setItem("taskIdToBeUpdated", taskId);
    console.log(taskId);
    $(".editpopUp").slideDown();
  })

  ///////////////
  $('.editTask').submit(function(e){
   var taskId = localStorage.getItem("taskIdToBeUpdated");
   taskId = parseInt(taskId);
    e.preventDefault();
    console.log('submitted');
    var task = {};
    var formData = $(".editTask").serializeArray();
    console.log("new task details",formData);
    for(var i =0 ; i < formData.length ; i++){
      console.log(formData[i].value);
      task[formData[i].name] = formData[i].value;
    }
    console.log("task data",task);
    tasks.updateTaskData(task,taskId).then(function(res){
      // resolve
      console.log(res.data);
      location.reload();
      tasks.renderAllTasks(res.data)
    },function(err){
      // reject
      console.log(err);
    })

  });

  $('body').on('click','.cancelUpdate',function(){
    $(".editpopUp").slideUp();
  })

  //Delete Task
  $('body').on('click','.delete',function(){
    $(this).parent().remove();
    console.log($(this).attr('data-id'));
    var taskName = $(this).attr('data-id');
    tasks.deleteTask(taskName);
  });
});

// drag & Drop
function dragstart(e) {
  e.dataTransfer.setData('data',e.target.id)
  e.dataTransfer.setData('class',e.target.class)
  console.log('drag started');
}
function dragover(e){
  e.preventDefault();
}
function dropcomp(e){
  // e.preventDefault();
var className= e.dataTransfer.getData('class');
var id=  e.dataTransfer.getData('data');
console.log(className);
console.log(id);
  e.target.appendChild(document.getElementById(id))
  tasks.updateTaskState1(id);
  console.log('drop!');
}
function dropnotcomp(e){
  // e.preventDefault();
var className= e.dataTransfer.getData('class');
var id=  e.dataTransfer.getData('data');
console.log(className);
console.log(id);
  e.target.appendChild(document.getElementById(id))
  tasks.updateTaskState2(id);
  console.log('drop!');
}
