$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })


    var userinfo = null
        // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取信息失败!')
                }
                console.log(res.data);
                // 调用 form.val() 给表单赋值
                form.val('formUserInfo', res.data)
                userinfo = res.data
            }
        })
    }

    // 重置表单数据
    $('#btnReset').on('cilck', function(e) {
            // 阻止表单的默认重置行为
            e.preventDefault()
                // initUserInfo()

        })
        // 利用 `lay-verify` 来设置自定义校验规则
    $(function() {
        var form = layui.form

        form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            samePwd: function(value) {
                if (value === $('[name=oldPwd]').val()) {
                    return '新旧密码不能相同！'
                }
            },
            rePwd: function(value) {
                if (value !== $('[name=newPwd]').val()) {
                    return '两次密码不一致！'
                }
            }
        })
    })


    // 监听表单的提交事件
    $('.layui-form').on('submir', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
            // 发起 ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败!')
                }
                layer.msg('更新用户信息成功!')
                    // 调用父页面中的方法,重新渲染用户的头像和用户信息

                window.parent.getUserInfo()
            }
        })
    })
})