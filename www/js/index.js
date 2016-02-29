/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var id = 2;

$(document).ready(function() {

    addTodoButtonHandler();
    checkUser();
    checkTime();
    //createTable();
    //insertTestRow();
    refreshTodoList();
});

function addTodoButtonHandler() {
    $('#addTodo').on('click', function() {
        id++;
        var user = $('#inputUser').val();
        var description = $('#inputDescription').val();

        addNewTodo(user, description);
    });
}

function checkUser() {
    $('#checkboxUser').change(function() {
        var checked = $('#checkboxUser').prop('checked');
        window.localStorage.setItem("checkUser", checked);
    });
}

function checkTime() {
    $('#checkboxTime').change(function() {
        var checked = $('#checkboxTime').prop('checked');
        window.localStorage.setItem("checkTime", checked);
    });
}

function refreshList() {
    $('#checkUser').text(window.localStorage.getItem("checkUser"));
    $('#checkTime').text(window.localStorage.getItem("checkTime"));
}

$(document).on('pagechange', function() {
    refreshList();
    refreshTodoList();
});


// DATABASE 
var db = openDatabase('todo_db', '1.0', 'Phua\'s database', '2 * 1024 * 1024');

function createTable() {
    db.transaction(function(tx) {
        //tx = transaction
        //sql magic here
        tx.executeSql('CREATE TABLE IF NOT EXISTS todo (id unique, user TEXT, description TEXT, time TEXT)');
        alert('created table');
    });
}

function insertTestRow() {
    //insert test row
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO todo (id, user, description, time) VALUES (1, "raymondphua", "huiswerk maken", "28-02-2016 22:00")');
        tx.executeSql('INSERT INTO todo (id, user, description, time) VALUES (2, "raymondphua", "huiswerk maken numero 2", "28-02-2016 22:20")');
        alert('inserted rows');
    });
}

function addNewTodo(user, description) {
    //insert new todo row
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO todo (id, user, description, time) VALUES (?, ?, ?, "Test tijd moet nog gedaan worden")', [id, user, description]); 
    });

    $.mobile.changePage("#todoListPage", {
        transition: "pop",
        changeHash: false
    });
}

function refreshTodoList() {
    //get all rows
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM todo', [], function (tx, results) {
          var len = results.rows.length, i;
          var ul = $('#todoList ul');
          var userChecked = window.localStorage.getItem("checkUser");
          var timeChecked = window.localStorage.getItem("checkTime");
          ul.empty();
          for (i = 0; i < len; i++) {
            if (userChecked && timeChecked) {
                ul.append(  '<li>' +
                                '<label id="todoId">' + results.rows.item(i).id + '</labeL>' +
                                '<label id="todoUser">' + results.rows.item(i).user + '</label>' +
                                '<label id="todoDescription">' + results.rows.item(i).description + '</label>' +
                                '<label id="todoTime">' + results.rows.item(i).time + '</label>' + 
                            '</li>');
                //alert(results.rows.item(i).description);
            } else if (userChecked) {
                ul.append(  '<li>' +
                                '<label id="todoId">' + results.rows.item(i).id + '</labeL>' +
                                '<label id="todoUser">' + results.rows.item(i).user + '</label>' +
                                '<label id="todoDescription">' + results.rows.item(i).description + '</label>' +
                            '</li>');
            } else if (timeChecked) {
                ul.append(  '<li>' +
                                '<label id="todoId">' + results.rows.item(i).id + '</labeL>' +
                                '<label id="todoDescription">' + results.rows.item(i).description + '</label>' +
                                '<label id="todoTime">' + results.rows.item(i).time + '</label>' + 
                            '</li>');
            } else {
                ul.append(  '<li>' +
                                '<label id="todoId">' + results.rows.item(i).id + '</labeL>' +
                                '<label id="todoDescription">' + results.rows.item(i).description + '</label>' +
                            '</li>');
            }
          }
          ul.listview('refresh');
        });
    });
}