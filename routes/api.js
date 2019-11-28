var express = require('express');
var router = express.Router();
var mysql = require('mysql');

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};


// mysql conection
var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'admin',
    password : '1234',
    port     : 3306,
    database : 'todo'
});

/* GET users listing. */
router.get('/todo', function(req, res, next) {
    conn.query('SELECT * FROM todo' , (err , rows)=>{
        if(err) {
            res.status(401).send({
                err : err,
                mesg : '연결이 실패했습니다.'
            })
        }
        
        res.send(rows);
    });
});

router.post('/todo' , (req , res)=>{
    let body = req.body;
    
    console.log(body);
    
    if(!body.context || body.context.trim() === ""){
        res.status(500).send({
            status : -1,
            mesg : '텍스트가 비어있습니다.'
        });
    }
    
    let now = new Date();
    let sql = 'INSERT INTO todo (`context` , `create_dt` ) values (';
    sql += " '"+ body.context +"',";
    sql += "'" + now.toMysqlFormat() + "' );";
    console.log(sql);
    
    conn.query(sql , (err)=>{
        if(err) {
            res.status(401).send({
                err : err,
                mesg : '연결이 실패했습니다.'
            })
        }

        res.send("성공했습니다");
    });
});

router.put('/todo/:id' , (req , res)=>{
    if(!req.params.id){ 
        res.status(500).send({
            mesg : '아이디가 올바르지 않습니다'
        });
        return;
    }
    console.log(req.body);
    let sql = "UPDATE todo SET is_closed = " + (req.body.is_closed ? 1 : 0 )+ "  WHERE id = "+req.params.id+"";
    console.log("sql : " , sql);
    conn.query(sql , (err)=>{
        if(err) {
            res.status(401).send({
                err : err,
                mesg : '연결이 실패했습니다.'
            })
            return;
        }

        res.send("성공했습니다");
    });
});

router.delete('/todo/:id' , (req , res)=>{
    if(!req.params.id){ 
        res.status(500).send({
            mesg : '아이디가 올바르지 않습니다'
        });
        return;
    }
    let sql = "DELETE FROM todo WHERE id = "+req.params.id+"";
    conn.query(sql , (err)=>{
        if(err) {
            res.status(401).send({
                err : err,
                mesg : '연결이 실패했습니다.'
            })
            return;
        }

        res.send("성공했습니다");
    });
})

module.exports = router;
