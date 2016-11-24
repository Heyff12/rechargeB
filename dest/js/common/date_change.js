define(function() {　
    //时间格式化 从2016-09-22 11:22:33到2016.9.18
    function time_change(time) {
        var date_val = time.substr(0, 10);
        var date_value = date_val.split('-');
        var year = date_value[0];
        var month = num_change(date_value[1]);
        var day = num_change(date_value[2]);
        var new_date = year + '.' + month + '.' + day;
        return new_date;
    }

    function time_change2(time1, time2) {
        var date_val1 = time1.substr(0, 10);
        var date_val2 = time2.substr(0, 10);
        var date_value1 = date_val1.split('-');
        var date_value2 = date_val2.split('-');
        var year1 = date_value1[0];
        var year2 = date_value2[0];
        var month = num_change(date_value2[1]);
        var day = num_change(date_value2[2]);
        var year;
        if (year1 != year2) {
            return year2 + '.' + month + '.' + day;
        } else {
            return month + '.' + day;
        }
    }

    function num_change(num) {
        if (num < 10) {
            return num.substr(-1);
        } else {
            return num;
        }
    }
    //测试时间转化
    // test();
    // function test(){
    //     var start_time='2016-09-22 11:22:33';
    //     var end_time='2016-09-02 11:22:33';
    //     var s_time=date_change.time_change(start_time);
    //     var e_time=date_change.time_change2(start_time,end_time);
    //     console.log(s_time+' ---- '+e_time) ;
    // }

    return {
        time_change: time_change,
        time_change2: time_change2,
    };　
});
