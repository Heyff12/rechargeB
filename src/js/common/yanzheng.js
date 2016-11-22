define(function() {　
    //获取url的指定hash值
    function get_hash(hash_val) {
        var c_val;
        if (location.href.split('?').length < 2) {
            return false;
        }
        var url_l = location.href.split('?')[1].split('&');
        var url_l_l = url_l.length;
        for (var i = 0; i < url_l_l; i++) {
            var url_val = url_l[i].split('=');
            if (url_val[0] == hash_val) {
                c_val = url_val[1];
                return c_val;
            }
        }
    }
    //验证中文-----add_new
    function china_test(id, num1, num2) {
        var val = $(id).val();
        var val_exp = new RegExp("^[\u4e00-\u9fa5]{" + num1 + "," + num2 + "}$"); // /^[\u4e00-\u9fa5]{num1,num2}$/
        if (!val_exp.test(val)) {
            $(id).addClass('border_red');
        } else {
            $(id).removeClass('border_red');
        }
    }
    //验证手机号-----add_new
    function tel_test(id) {
        var val = $(id).val();
        var val_exp = /^1[0-9]{10}$/;
        if (!val_exp.test(val)) {
            $(id).addClass('border_red');
        } else {
            $(id).removeClass('border_red');
        }
    }
    //验证生日-----add_new
    function birth_test(id, num1, num2) {
        var val = $(id).val();
        var val_l = val.length;
        if (val_l <= num1 || val_l > num2) {
            $(id).addClass('border_red');
        } else {
            $(id).removeClass('border_red');
        }
    }
    //弹框高度定位----add_new
    function alert_top(id) {
        var alert_height = $(id).height();
        var mar_t = (alert_height / 2) - 20;
        $(id).css('marginTop', -mar_t + 'px');
    }
    return {
        get_hash: get_hash,
        china_test: china_test,
        tel_test: tel_test,
        birth_test: birth_test,
        alert_top: alert_top,
    };　
});
