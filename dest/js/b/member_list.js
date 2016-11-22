require.config({
    baseUrl: "../../dest/js",
    paths: {
        "jquery": ["plug/jquery-2.1.4.min", "plug/jquery-1.7.2.min", "http://libs.baidu.com/jquery/2.0.3/jquery"],
        "zepto": "plug/zepto.min",
        "mobile": "plug/date/jquery.mobile-1.4.5.min",
        "mobiscroll": "plug/date/mobiscroll", //通过shim绑定关联模块jquery
        "yanzheng": "common/yanzheng", //将通用方法放在同一个模块中
        "ajaxps": "common/ajaxps", //在模块中调用其他模块的方法
        "date": "common/date", //在模块中调用其他模块的方法
        "close_tip": "common/close_tip", //在模块中调用其他模块的方法
        "date_change": "common/date_change", 
    },
    shim: {　　　　　　
        'mobiscroll': {　　　　　　　　
            deps: ['jquery'],            　　　　　　　　
            exports: 'mobiscroll'　　　　　　
        },        　　　　　
        'jsonp': {　　　　　　　　
            deps: ['jquery'],            　　　　　　　　
            exports: 'jsonp'　　　　　　
        },
        'zepto': {　　　　　　　　　　　　　　　　
            exports: '$'　　　　　　
        }
    }
})
require(["zepto", "yanzheng", "close_tip"], function($, yanzheng, close_tip) {
    $(function() {
        //滚动下拉-------start--------------------------------------------------------
        var timer_rt = null;
        var scroll_if = false;
        var b=1;
        // console.log(scroll_if);
        var window_height = window.innerHeight;
        var body_height= $('body').height();
        // console.log(window_height);
        // console.log(body_height); 
        //活动储值详情----------------------------------------------------------------------------------------------------------------------------------------------------
        $('.js_member_list').get(0) && (~ function() {
            $(document).ready(function() {
                //获取会员列表todo-show
                //get_rechargeli();
                append_ul();
            });
        }());
        $(window).on('scroll', function(e) {
            // console.log(scroll_if); 
            //var history_top = $(document).scrollTop();
            //console.log(history_top); 
            var history_top=document.documentElement.scrollTop||document.body.scrollTop;
            // console.log('document.documentElement.scrollTop--'+document.documentElement.scrollTop);
            // console.log('document.body.scrollTop--'+document.body.scrollTop);
            if (history_top < body_height - window_height) {
                clearTimeout(timer_rt);
            } else if (scroll_if) {
                e.stopPropagation();
                $('.load').show();
                scroll_if = false;
                timer_rt = window.setTimeout(append_ul, 3000);
            }
        });
        function append_ul() {
            var con_list = '<li><dl><dt><img src="../../dest/img/wxchar.png"></dt><dd>韩梅梅</dd><dd class="grey"><i class="icon_tel"></i>13189569856</dd><dd class="grey">储值<span class="orange">2次</span></dd><div class="clearfix"></div></dl><p><span class="grey">余额</span><br/><span class="orange">￥<i class="i_normal">35.26</i></span></p></li>';
            var con_list1 = '<li><dl><dt><img src="../../dest/img/ic_shop_round@3x.png"></dt><dd>韩梅梅</dd><dd class="grey"><i class="icon_tel"></i>13189569856</dd><dd class="grey">储值<span class="orange">2次</span></dd><div class="clearfix"></div></dl><p><span class="grey">余额</span><br/><span class="orange">￥<i class="i_normal">35.26</i></span></p></li>';
            
            var list;
            if (b == '1') {
                list = con_list1;
                b = 0;
            } else {
                list = con_list;
                b = 1;
            }
            for(var i=0;i<20;i++){
                $('.js_ul_members').append(list);
            }
            $('.load').hide();
            scroll_if = true;
            body_height = Math.floor($('body').height()).toFixed(0);
            // console.log(body_height); 
        }
        //获取会员列表
        function get_rechargeli() {
            $.ajax({
                url: '/prepaid/v1/api/b/members',
                type: 'GET',
                dataType: 'json',
                data: {
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
                            var cz_avatar = return_data[i].avatar;
                            var cz_recharge_times = return_data[i].recharge_times;
                            var cz_mobile = return_data[i].mobile;
                            var cz_name = return_data[i].name;
                            var cz_balance = (return_data[i].balance / 100).toFixed(2);
                            var li_detail='<li><dl><dt><img src="' + cz_avatar + '"></dt><dd>' + cz_name + '</dd><dd class="grey"><i class="icon_tel"></i>' + cz_mobile + '</dd><dd class="grey">储值<span class="orange">' + cz_recharge_times + '次</span></dd><div class="clearfix"></div></dl><p><span class="grey">余额</span><br/><span class="orange">￥<i class="i_normal">' + cz_balance + '</i></span></p></li>';                            
                            $(".js_ul_members").append(li_detail);
                        });
                        var pos_val = $('#js_pos').val() - 0;
                        if (return_data.length < 20) {
                            $('#alert_alert').show();
                            $('#alert_alert .alert_con_br').html('数据已加载完毕');
                            $('.zheceng1').show();
                            scroll_if = false;
                        } else {
                            pos_val += 20;
                            $('#js_pos').val(pos_val);
                            scroll_if = true;
                        }
                        $('.zheceng').hide();
                        $('.load').hide();
                        body_height = $('body').height();
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
                }
            });
        }
        //关闭弹框
        close_tip.close_tip();

    })
})
