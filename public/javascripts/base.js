angular.module('todoApp' , [])
.controller('todoController' , ['$scope' , '$http' , function($s, $http){
    let conn = {
        submit : ()=>{
            return $http({
                url : '/api/todo',
                method : 'post',
                data : { 
                    context : $s.data.todo
                }
            })
            .then(res=>{
                $s.data.todo = "";
            })
            .catch(res=>{
                 console.log('err!' , res);
            });
        },
        update : (item)=>{
            return $http({
                url : '/api/todo/' + item.id,
                method : 'put',
                data : {
                    is_closed : !item.is_closed
                }
            }).catch(res=>{
                 console.log('err!' , res);
            });
        },
        del : (id)=>{
            return $http({
                url : '/api/todo/' + id,
                method : 'DELETE',
            }).catch(res=>{
                 console.log('err!' , res);
            });
        },
        get : ()=>{
            return $http({
                url : '/api/todo',
                method : 'get',
            })
            .catch(res=>{
                 console.log('err!' , res);
            });
        }
    }
    
    $s.data = {};
    
    $s.data.todoList = [
        {text : "Hello World" , isClosed : true },
        {text : "Hello World" , isClosed : false },
        {text : "Hello World" , isClosed : true },
        {text : "Hello World" , isClosed : false }
    ];
    
    $s.data.todo = "";
    $s.data.remain_todo = 0;
    
    $s.fn = {};
    
    $s.fn.get = () => {
        return conn.get()
        .then(res=>{
            $s.data.remain_todo = 0;
            $s.data.todoList = res.data;
            
            $s.data.todoList.map(item=>{
                if(!item.is_closed) { $s.data.remain_todo++; }
            });    
        });
    }
    $s.fn.submit = () => {
        if($s.data.todo.trim() === "" ){ alert('비어있습니다.'); return; }
        conn.submit()
        .then($s.fn.get);
    }
    
    $s.fn.setStatus = (item) => {
        conn.update(item)
        .then($s.fn.get);
    }
    
    $s.fn.del = id => {
        conn.del(id)
        .then($s.fn.get);
    }
    
    
    function init(){
        $s.fn.get();
    }
    
    init();
}]);