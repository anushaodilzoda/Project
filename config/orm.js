var connection = require("../../config/connection.js");


var orm = {
    select: function(columnName, tableName, cb) {
      var queryString = "SELECT "+columnName+" FROM " + tableName + ";";
      connection.query(queryString, function(err, result) {
        if (err) {
          throw err;
        }
        cb(result);
      });
    },
    selectWithCondition: function(columnName, tableName, condition, cb){
      console.log("in the orm");
        var queryString="SELECT "+columnName+" FROM "+tableName+" WHERE "+condition+";";
        connection.query(queryString, function(err, result){
            if(err){
                throw err;
            }
            cb(result);
        })
    },
    // getAllEmployee: function(cb){
    //   connection.query("SELECT e.id, e.first_name, e.last_name, r.title, d.department,  r.salary,(SELECT CONCAT(first_name,' ', last_name) FROM employee WHERE id=e.manager_id) AS manager FROM employee e JOIN role r ON e.role_id=r.id JOIN department d ON r.department_id=d.id",function(err, data){
    //     if(err) throw err;
    //     cb(data);
    // })
    // },
    // delete: function(firstName, lastName,tableName){
    //   connection.query("DELETE from "+tableName+" WHERE first_name='"+firstName+"'"+" AND last_name='"+lastName+"'");
    // },
    update: function(table, columnName, newValue, condition) {
      var queryString = "UPDATE " + table+" SET "+columnName+"='"+newValue+"' WHERE "+condition+";";
      connection.query(queryString, function(err, result) {
        if(err) throw err;
      });
    }
    // insertEmployee: function (firstName, lastName, roleId, managerId){
    //   var queryString="INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('"+firstName+"', '"+lastName+"',"+roleId+","+managerId+");";
    //   console.log(queryString);
    //   connection.query(queryString, function(err, result){
    //     if(err) throw err;
    //   })
    // },
    // insertRole: function (title, salary, department_id){
    //   var queryString="INSERT INTO role (title, salary, department_id) VALUES ('"+title+"', '"+salary+"', "+department_id+");";
    //   console.log(queryString);
    //   connection.query(queryString, function(err, result){
    //     if(err) throw err;
    //   })
    // },
    // insertDepartment: function (department){
    //   var queryString="INSERT INTO department (department) VALUES ('"+department+"');";
    //   console.log(queryString);
    //   connection.query(queryString, function(err, result){
    //     if(err) throw err;
    //   })
    // }
  };

  

module.exports = orm;
