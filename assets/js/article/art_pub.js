// 定义 `initCate` 方法，请求文章类别的列表，利用模板引擎渲染到页面
$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate()
        // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }
    // 初始化富文本编辑器
    initEditor()


    // 实现基本裁剪效果
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })



    //     - 监听 `coverFile` 的 `change` 事件，获取用户选择的文件列表
    // - 跟进文件，创建对应的 URL 地址
    // - 为裁剪区域重新设置图片
    //   - 销毁旧的裁剪区域
    //   - 重新设置图片路径
    //   - 重新初始化裁剪区域
    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组
        var files = e.target.files
            // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
            // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'
        // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 基于`Form`表单创建`FormData`对象
    // 为表单绑定 `submit` 提交事件

    // - 阻止表单默认提交行为
    // - 基于 `form` 表单，快速创建一个 `FormData` 对象
    // - 将文章的发布状态，存到 `FormData` 对象中

    $('#form-pub').on('submit', function(e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
            // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
            // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)
        fd.append('content', tinymce.activeEditor.getContent())

        // 将裁剪后的封面追加到`FormData`对象中
        // 为表单绑定 submit 提交事件
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })


    // 发起`Ajax`请求实现发布文章的功能
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
    // 把裁剪的图片追加到 `FormData` 对象中之后，调用 `publishArticle` 方法
    // 为表单绑定 submit 提交事件
    // $('#form-pub').on('submit', function(e) {
    //     // 1. 阻止表单的默认提交行为
    //     e.preventDefault()
    //         // 2. 基于 form 表单，快速创建一个 FormData 对象
    //     var fd = new FormData($(this)[0])
    //         // 3. 将文章的发布状态，存到 fd 中
    //     fd.append('state', art_state)
    //         // 4. 将封面裁剪过后的图片，输出为一个文件对象
    //     $image
    //         .cropper('getCroppedCanvas', {
    //             // 创建一个 Canvas 画布
    //             width: 400,
    //             height: 280
    //         })
    //         .toBlob(function(blob) {
    //             // 将 Canvas 画布上的内容，转化为文件对象
    //             // 得到文件对象后，进行后续的操作
    //             // 5. 将文件对象，存储到 fd 中
    //             fd.append('cover_img', blob)
    //                 // 6. 发起 ajax 数据请求
    //             publishArticle(fd)
    //         })
    // })
})