require.config({
    baseUrl: "../dest/js",
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
        "jsonp": "plug/jquery.jsonp",
        //"require-config": "common/require-config",
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
});