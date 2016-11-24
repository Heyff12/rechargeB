"use strict";

function hideMenu() {
    WeixinJSBridge.call('hideOptionMenu');
    WeixinJSBridge.call('hideToolbar');
}
if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', hideMenu, false);
    } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', hideMenu);
        document.attachEvent('onWeixinJSBridgeReady', hideMenu);
    }
} else {
    hideMenu();
}
//个人中心首页----------------------------------------------------------------------------------------------------------------------------------------------------
$('.js_usercenter_index').get(0) && (~ function() {
    $(document).ready(function() {
        //获取储值列表todo-show
        //get_rechargeli_c();
        //点击进入储值详情
        $('.js_usercenter_ul li header').on('click', function() {
            var url_detail = $(this).parents('li').attr('data-url');
            location.href = url_detail;
        });
        $('.js_usercenter_ul li .zhe').on('click', function() {
            var url_detail = $(this).parents('li').attr('data-url');
            location.href = url_detail;
        });
    });
}());
//个人中心详情----------------------------------------------------------------------------------------------------------------------------------------------------
$('.js_usercenter_detail').get(0) && (~ function() {
    $(document).ready(function() {
        //获取储值详情todo-show
        //get_rechargedetail();
    });
}());
// var dl_data = $(".js_datadl").map(function() {
//     return $(this).attr('data-bizsn');
// }).get();
var dl_data = $(".js_datadl").map(function() {
    return $(this).attr('data-bizsn');
});
var dl_data_set = new Set(dl_data.get(0));
//个人中心列表----------------------------------------------------------------------------------------------------------------------------------------------------
$('.js_usercenter_list').get(0) && (~ function() {
    $(document).ready(function() {
        //获取储值列表todo-show
        //get_rechargelist();
        // 初始化插件内容------作废
        // var opt_data = {
        //     preset: 'date', //日期格式 date（日期）|datetime（日期加时间）
        //     theme: 'jqm', //皮肤样式
        //     display: 'modal', //显示方式
        //     mode: 'clickpick', //日期选择模式
        //     dateFormat: 'yy-mm', // 日期格式
        //     setText: '确定', //确认按钮名称
        //     cancelText: '取消', //取消按钮名籍我
        //     dateOrder: 'yymmdd', //面板中日期排列格式
        //     dayText: '日',
        //     monthText: '月',
        //     yearText: '年', //面板中年月日文字
        //     yearText: '年',
        //     monthText: '月',
        //     dayText: '日', //面板中年月日文字
        //     endYear: 2020, //结束年份
        //     showNow: true,
        //     nowText: '今天',
        //     hourText: '小时',
        //     minuteText: '分'
        // };
        // 使用定义插件------作废
        //$("#f_companydate").mobiscroll(opt_data);
        //根据日期查询
        // $('.js_date_history').on('click', function() {
        //     $('.js_diff_get').html('');
        //     get_rechargelist();
        // });
    });
    //点击查看更多
    $('.js_click_more').on('click', function() {
        //get_history_touch();
        //测试去重
        get_dl();
    });
}());
// var dl_data_set_l=dl_data_set.size;
// // console.log(dl_data);
// // console.log(dl_data.length);
// // console.log(dl_data_set);
// // console.log(dl_data_set.size);
// var dl_data_new=new Set(['20160922004499345690']);
// dl_data_set=new Set([...dl_data_set, ...dl_data_new]);
// var dl_data_set_new_l=dl_data_set.size;
// if(dl_data_set_new_l==dl_data_set_l){
//     console.log(dl_data_set);
//     console.log('相同排除');
// }else{
//     console.log(dl_data_set);
//     console.log('不同添加');
// }
// var dl_data_new1=new Set(['20160922004499345690']);
// dl_data_set=new Set([...dl_data_set, ...dl_data_new1]);
// var dl_data_set_new_l1=dl_data_set.size;
// if(dl_data_set_new_l1==dl_data_set_l){
//     console.log(dl_data_set);
//     console.log('相同排除');
// }else{
//     console.log(dl_data_set);
//     console.log('不同添加');
// }
//测试去重
function get_dl() {
    console.log(dl_data_set);
    var dl_data_set_l = dl_data_set.size;
    var data_arr = ['20160922004499345678', '20160922004499345692', '20160922004499345699', '20160922004499345694', '20160922004499345695', '20160922004499345696', '20160922004499345697', '20160922004499345690', '20160922004499345698', '20160922004499345699', '20160922004499345992'];
    var ind = (Math.random() * 10).toFixed(0);
    var data_arr_n = [data_arr[ind]];
    console.log(ind);
    // var dl_data_new = new Set(data_arr_n);
    // dl_data_set = new Set([...dl_data_set, ...dl_data_new]);
    dl_data_set.add(data_arr[ind]);
    var dl_data_set_new_l = dl_data_set.size;
    if (dl_data_set_new_l === dl_data_set_l) {
        console.log('相同' + dl_data_set + '____' + data_arr_n);
        return false;
    } else {
        console.log('不同' + dl_data_set + '____' + data_arr_n);
    }
    var li_detail = '<dl class="js_datadl" data-bizsn="' + data_arr[ind] + '"><dt>-48.00</dt><dd>储值消费</dd><dd class="grey">2016-08-10 15:06:55</dd><div class="clearfix"></div></dl>';
    $("#js_diff_get").append(li_detail);
}
//获取储值列表
function get_rechargelist() {
    $.ajax({
        url: '/prepaid/v1/api/transactions',
        type: 'GET',
        dataType: 'json',
        data: {
            'c': get_hash('c'),
            'h': get_hash('h'),
            'pos': $('#js_pos').val(),
            'count': 20,
        },
        beforeSend: function() {
            $('#loading').show();
            $('.zheceng').show();
        },
        success: function(data) {
            if (data.respcd != '0000') {
                $('#alert_alert').show();
                $('.zheceng').show();
                if (!data['respmsg']) {
                    $('#alert_alert .alert_con_br').html(data['resperr']);
                } else {
                    $('#alert_alert .alert_con_br').html(data['respmsg']);
                }
            } else {
                var return_data = data.data;
                $(return_data).each(function(i, item) {
                    var dl_data = $(".js_datadl").map(function() {
                        return $(this).attr('data-bizsn');
                    }).get();
                    var dl_data_set_l = dl_data.length;
                    var tx_txamt = (return_data[i].txamt / 100).toFixed(2);
                    var tx_pay_amt = (return_data[i].pay_amt / 100).toFixed(2);
                    var tx_present_amt = (return_data[i].present_amt / 100).toFixed(2);
                    var tx_pay_amt0 = (return_data[i].pay_amt / 100).toFixed(0);
                    var tx_present_amt0 = (return_data[i].present_amt / 100).toFixed(0);
                    var tx_time = return_data[i].sysdtm;
                    var tx_status = return_data[i].biz_type;
                    var biz_sn = return_data[i].biz_sn;
                    var tx_name, tx_price;
                    var li_detail;
                    //判断流水号是否重复
                    var bizn_has = '0';
                    for (var i = dl_data_set_l - 1; i > 0; i--) {
                        if (dl_data[i] == biz_sn) {
                            bizn_has = '1';
                            break;
                        }
                    }
                    if (bizn_has == '1') {
                        return true;
                    }
                    if (tx_status == '1') {
                        tx_name = '储值';
                        tx_price = '+' + tx_pay_amt;
                        li_detail = '<dl class="js_datadl" data-bizsn="' + biz_sn + '"><dt class="orange">+' + tx_present_amt + '</dt><dd>储值赠送<span class="buy_back orange">储值' + tx_pay_amt0 + '送' + tx_present_amt0 + '</span></dd><dd class="grey">' + tx_time + '</dd><div class="clearfix"></div></dl><dl><dt class="orange">' + tx_price + '</dt><dd>' + tx_name + '</dd><dd class="grey">' + tx_time + '</dd><div class="clearfix"></div></dl>';
                    } else {
                        tx_name = '储值消费';
                        tx_price = '-' + tx_pay_amt;
                        li_detail = '<dl class="js_datadl" data-bizsn="' + biz_sn + '"><dt>' + tx_price + '</dt><dd>' + tx_name + '</dd><dd class="grey">' + tx_time + '</dd><div class="clearfix"></div></dl>';
                    }
                    $("#js_diff_get").append(li_detail);
                });
                var pos_val = $('#js_pos').val() - 0;
                if (return_data.length < 20) {
                    $('#alert_alert').show();
                    $('#alert_alert .alert_con_br').html('数据已加载完毕');
                    $('.zheceng1').show();
                    $('.js_click_more').hide();
                } else {
                    $('.js_click_more').show();
                    pos_val += 20;
                    $('#js_pos').val(pos_val);
                }
                $('.zheceng').hide();
            }
        },
        error: function(data) {
            $('#alert_alert').show();
            $('.zheceng').show();
            //$('.alert_con .alert_con_br').html('XMLHttpRequest.readyState:'+XMLHttpRequest.readyState+',XMLHttpRequest.status:'+XMLHttpRequest.status+',textStatus:'+textStatus+'!');
            $('#alert_alert .alert_con_br').html('网络超时!');
        },
        complete: function() {
            $('#loading').hide();
            //$('.zheceng').hide();
        }
    });
}
function get_rechargelist_set() {
    $.ajax({
        url: '/prepaid/v1/api/transactions',
        type: 'GET',
        dataType: 'json',
        data: {
            'c': get_hash('c'),
            'h': get_hash('h'),
            'pos': $('#js_pos').val(),
            'count': 20,
        },
        beforeSend: function() {
            $('#loading').show();
            $('.zheceng').show();
        },
        success: function(data) {
            if (data.respcd != '0000') {
                $('#alert_alert').show();
                $('.zheceng').show();
                if (!data['respmsg']) {
                    $('#alert_alert .alert_con_br').html(data['resperr']);
                } else {
                    $('#alert_alert .alert_con_br').html(data['respmsg']);
                }
            } else {
                var return_data = data.data;
                $(return_data).each(function(i, item) {
                    var tx_txamt = (return_data[i].txamt / 100).toFixed(2);
                    var tx_pay_amt = (return_data[i].pay_amt / 100).toFixed(2);
                    var tx_present_amt = (return_data[i].present_amt / 100).toFixed(2);
                    var tx_time = return_data[i].sysdtm;
                    var tx_status = return_data[i].biz_type;
                    var biz_sn = return_data[i].biz_sn;
                    var tx_name, tx_price;
                    var li_detail;
                    //判断流水号是否重复
                    var dl_data_set_l = dl_data_set.size;
                    // var dl_data_new = new Set([biz_sn]);
                    // dl_data_set = new Set([...dl_data_set, ...dl_data_new]);
                    dl_data_set.add(biz_sn);
                    var dl_data_set_new_l = dl_data_set.size;
                    if (dl_data_set_new_l === dl_data_set_l) {
                        return false;
                    }
                    if (tx_status == '1') {
                        tx_name = '储值';
                        tx_price = '+' + tx_pay_amt;
                        li_detail = '<dl class="js_datadl" data-bizsn="' + biz_sn + '"><dt class="orange">+' + tx_present_amt + '</dt><dd>储值赠送<span class="buy_back orange">储值' + tx_pay_amt + '送' + tx_present_amt + '</span></dd><dd class="grey">' + tx_time + '</dd><div class="clearfix"></div></dl><dl><dt class="orange">' + tx_price + '</dt><dd>' + tx_name + '</dd><dd class="grey">' + tx_time + '</dd><div class="clearfix"></div></dl>';
                    } else {
                        tx_name = '储值消费';
                        tx_price = '-' + tx_pay_amt;
                        li_detail = '<dl class="js_datadl" data-bizsn="' + biz_sn + '"><dt>' + tx_price + '</dt><dd>' + tx_name + '</dd><dd class="grey">' + tx_time + '</dd><div class="clearfix"></div></dl>';
                    }
                    $("#js_diff_get").append(li_detail);
                });
                var pos_val = $('#js_pos').val() - 0;
                if (return_data.length < 20) {
                    $('#alert_alert').show();
                    $('#alert_alert .alert_con_br').html('数据已加载完毕');
                    $('.zheceng').show();
                    $('.js_click_more').hide();
                } else {
                    $('.js_click_more').show();
                    pos_val += 20;
                    $('#js_pos').val(pos_val);
                }
                $('.zheceng').hide();
            }
        },
        error: function(data) {
            $('#alert_alert').show();
            $('.zheceng').show();
            //$('.alert_con .alert_con_br').html('XMLHttpRequest.readyState:'+XMLHttpRequest.readyState+',XMLHttpRequest.status:'+XMLHttpRequest.status+',textStatus:'+textStatus+'!');
            $('#alert_alert .alert_con_br').html('网络超时!');
        },
        complete: function() {
            $('#loading').hide();
            //$('.zheceng').hide();
        }
    });
}
//获取余额提列表页详情-向上滑动刷新---取消使用
function get_rechargelist() {
    $.ajax({
        url: '/prepaid/v1/api/transactions',
        type: 'GET',
        dataType: 'json',
        data: {
            'c': get_hash('c'),
            'h': get_hash('h'),
            'pos': $('#js_pos').val(),
            'count': 20,
        },
        beforeSend: function() {
            $('#loading').show();
            $('.zheceng').show();
        },
        success: function(data) {
            if (data.respcd != '0000') {
                $('#alert_alert').show();
                $('.zheceng').show();
                if (!data['respmsg']) {
                    $('#alert_alert .alert_con_br').html(data['resperr']);
                } else {
                    $('#alert_alert .alert_con_br').html(data['respmsg']);
                }
            } else {
                var return_data = data.data;
                var dl_data = $(".js_datadl").map(function() {
                    return $(this).attr('data-bizsn');
                }).get();
                $(return_data).each(function(i, item) {
                    var tx_txamt = (return_data[i].txamt / 100).toFixed(2);
                    var tx_pay_amt = (return_data[i].pay_amt / 100).toFixed(2);
                    var tx_present_amt = (return_data[i].present_amt / 100).toFixed(2);
                    var tx_time = return_data[i].sysdtm;
                    var tx_status = return_data[i].biz_type;
                    var biz_sn = return_data[i].biz_sn;
                    var tx_name, tx_price;
                    var li_detail;
                    //判断流水号是否重复
                    var dl_data_set_l = dl_data_set.size;
                    // var dl_data_new = new Set([biz_sn]);
                    // dl_data_set = new Set([...dl_data_set, ...dl_data_new]);
                    dl_data_set.add(biz_sn);
                    var dl_data_set_new_l = dl_data_set.size;
                    if (dl_data_set_new_l === dl_data_set_l) {
                        return false;
                    }
                    if (tx_status == '1') {
                        tx_name = '储值';
                        tx_price = '+' + tx_pay_amt;
                        li_detail = '<dl class="js_datadl" data-bizsn="' + biz_sn + '"><dt class="orange">+' + tx_present_amt + '</dt><dd>储值赠送<span class="buy_back orange">储值' + tx_pay_amt + '送' + tx_present_amt + '</span></dd><dd class="grey">' + tx_time + '</dd><div class="clearfix"></div></dl><dl><dt class="orange">' + tx_price + '</dt><dd>' + tx_name + '</dd><dd class="grey">' + tx_time + '</dd><div class="clearfix"></div></dl>';
                    } else {
                        tx_name = '储值消费';
                        tx_price = '-' + tx_pay_amt;
                        li_detail = '<dl class="js_datadl" data-bizsn="' + biz_sn + '"><dt>' + tx_price + '</dt><dd>' + tx_name + '</dd><dd class="grey">' + tx_time + '</dd><div class="clearfix"></div></dl>';
                    }
                    $("#js_diff_get").append(li_detail);
                });
                var pos_val = $('#js_pos').val() - 0;
                if (return_data.length < 20) {
                    $('#alert_alert').show();
                    $('#alert_alert .alert_con_br').html('数据已加载完毕');
                    $('.zheceng').show();
                    $('.js_click_more').hide();
                } else {
                    $('.js_click_more').show();
                    pos_val += 20;
                    $('#js_pos').val(pos_val);
                }
                $('.zheceng').hide();
            }
        },
        error: function(data) {
            $('#alert_alert').show();
            $('.zheceng').show();
            //$('.alert_con .alert_con_br').html('XMLHttpRequest.readyState:'+XMLHttpRequest.readyState+',XMLHttpRequest.status:'+XMLHttpRequest.status+',textStatus:'+textStatus+'!');
            $('#alert_alert .alert_con_br').html('网络超时!');
        },
        complete: function() {
            $('#loading').hide();
            //$('.zheceng').hide();
        }
    });
}
//获取储值详情
function get_rechargedetail() {
    var userid = get_hash('h');
    $.ajax({
        url: '/prepaid/v1/api/c/merchants/' + userid,
        type: 'GET',
        dataType: 'json',
        data: {
            'c': get_hash('c'),
        },
        beforeSend: function() {
            $('#loading').show();
            $('.zheceng').show();
        },
        success: function(data) {
            if (data.respcd != '0000') {
                $('#alert_alert').show();
                $('.zheceng').show();
                if (!data['respmsg']) {
                    $('#alert_alert .alert_con_br').html(data['resperr']);
                } else {
                    $('#alert_alert .alert_con_br').html(data['respmsg']);
                }
            } else {
                var return_data = data.data;
                var tx_fee = (return_data.balance / 100).toFixed(2);
                var tx_url_pay = return_data.pay_url;
                var tx_url_add = return_data.recharge_url;
                var tx_url_list = return_data.prepaid_detail;
                var tx_merchant_name = return_data.merchant_name;
                var tx_expired = return_data.expired;
                document.title = tx_merchant_name;
                $('.js_detail_price').text(tx_fee);
                $('.js_charge_list').attr('href', tx_url_list);
                $('.js_detail_buy').attr('href', tx_url_add);
                $('.js_detail_pay').attr('href', tx_url_pay);
                if(tx_expired!='0'){
                    $('.js_detail_buy').hide();
                }else{
                    $('.js_detail_buy').show();
                }
                $('.zheceng').hide();
            }
        },
        error: function(data) {
            $('#alert_alert').show();
            $('.zheceng').show();
            //$('.alert_con .alert_con_br').html('XMLHttpRequest.readyState:'+XMLHttpRequest.readyState+',XMLHttpRequest.status:'+XMLHttpRequest.status+',textStatus:'+textStatus+'!');
            $('#alert_alert .alert_con_br').html('网络超时!');
        },
        complete: function() {
            $('#loading').hide();
            //$('.zheceng').hide();
        }
    });
}
//获取储值规则
function get_rule_detail() {
    $.ajax({
        url: '/prepaid/v1/api/c/rulexplain',
        type: 'GET',
        dataType: 'json',
        data: {
            'c': get_hash('c'),
            'h': get_hash('h'),
        },
        beforeSend: function() {
            $('#loading').show();
            $('.zheceng1').show();
        },
        success: function(data) {
            if (data.respcd != '0000') {
                $('#alert_alert').show();
                $('.zheceng1').show();
                if (!data['respmsg']) {
                    $('#alert_alert .alert_con_br').html(data['resperr']);
                } else {
                    $('#alert_alert .alert_con_br').html(data['respmsg']);
                }
            } else {
                var return_data = data.data;
                var return_data_l = return_data.length;
                for (var i = 0; i < return_data_l; i++) {
                    var li_detail = '<li><span>' + return_data[i] + '</span></li>';
                    $(".js_ul_rules").append(li_detail);
                }
                $('.zheceng1').hide();
            }
        },
        error: function(data) {
            $('#alert_alert').show();
            $('.zheceng1').show();
            //$('.alert_con .alert_con_br').html('XMLHttpRequest.readyState:'+XMLHttpRequest.readyState+',XMLHttpRequest.status:'+XMLHttpRequest.status+',textStatus:'+textStatus+'!');
            $('#alert_alert .alert_con_br').html('网络超时!');
        },
        complete: function() {
            $('#loading').hide();
            //$('.zheceng').hide();
        }
    });
}
//获取储值首页列表
function get_rechargeli_c() {
    //alert('获取列表');
    $.ajax({
        url: '/prepaid/v1/api/c/merchants',
        type: 'GET',
        dataType: 'json',
        data: {
            'c': get_hash('c'),
        },
        beforeSend: function() {
            $('#loading').show();
            $('.zheceng').show();
        },
        success: function(data) {
            //alert('获取列表success');
            if (data.respcd != '0000') {
                //alert('获取列表success-error');
                $('#alert_alert').show();
                $('.zheceng').show();
                if (!data['respmsg']) {
                    $('#alert_alert .alert_con_br').html(data['resperr']);
                } else {
                    $('#alert_alert .alert_con_br').html(data['respmsg']);
                }
            } else {
                //alert('获取列表success-in');
                var return_data = data.data;
                var data_length = return_data.length;
                $('.js_company_num').text(data_length);
                if (data_length == '0') {
                    $('.zheceng').hide();
                    return false;
                }
                $(return_data).each(function(i, item) {
                    var tx_fee = (return_data[i].max_cashback_amt / 100).toFixed(0); //返现最高金额
                    var tx_txamt = (return_data[i].balance / 100).toFixed(2);
                    var tx_name = return_data[i].merchant_name;
                    var tx_merchant_url = return_data[i].merchant_url;
                    var tx_recharge_url = return_data[i].recharge_url;
                    var tx_url_pay = return_data[i].pay_url;
                    var tx_url = return_data[i].prepaid_detail;
                    var li_detail = '<li data-url="' + tx_merchant_url + '"><header><span class="js_company_name">' + tx_name + '</span></header><p class="grey">储值余额</p><p class="price orange">￥<span class="js_company_diff">' + tx_txamt + '</span></p><dl class="company_dl"><dt><i class="sale"></i>最高返现金额达<span class="js_company_sale">' + tx_fee + '</span>元</dt><dd class="js_recharge_now"><a href="' + tx_recharge_url + '">立即储值</a></dd><div class="clearfix"></div></dl><span class="bg_img"></span><span class="zhe"></span></li>';
                    $(".js_usercenter_ul").append(li_detail);
                });
                $('.zheceng').hide();
            }
        },
        error: function(data) {
            //alert('获取列表error');
            $('#alert_alert').show();
            $('.zheceng').show();
            //$('.alert_con .alert_con_br').html('XMLHttpRequest.readyState:'+XMLHttpRequest.readyState+',XMLHttpRequest.status:'+XMLHttpRequest.status+',textStatus:'+textStatus+'!');
            $('#alert_alert .alert_con_br').html('网络超时!');
        },
        complete: function() {
            $('#loading').hide();
            //$('.zheceng').hide();
        }
    });
}
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
//获取当前时间
function now_date() {
    var n_date = new Date();
    var n_date_year = n_date.getFullYear();
    var n_date_mon = tow_num(n_date.getMonth() + 1);
    var n_date_day = tow_num(n_date.getDate());
    var n_date_h = tow_num(n_date.getHours());
    var n_date_m = tow_num(n_date.getMinutes());
    var n_date_mm = tow_num(n_date.getSeconds());
    var n_date_end = n_date_year + "-" + n_date_mon + "-" + n_date_day + " " + n_date_h + ":" + n_date_m + ":" + n_date_mm;
    return n_date_end;
}
//如果小于10，则十位显示0
function tow_num(arm) {
    var arm_num = "0" + arm;
    var arm_num_end = arm_num.substr(-2, 2);
    return arm_num_end;
}
//通用--------------------------------------------------------------------------------------------------------
//弹框高度定位
function alert_top(id) {
    var alert_height = $(id).height();
    var mar_t = alert_height / 2;
    $(id).css('marginTop', -mar_t + 'px');
}
//关闭弹框
$('.js_alert_con_close').on('click', function() {
    $('.alert_con').hide();
    // $('.alert_con .alert_con_br').html();
    $('.zheceng').hide();
    $('.zheceng1').hide();
});
