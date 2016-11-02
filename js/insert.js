function insertBook() {
    $.ajax({

        url:"http://localhost:8080/book/bookInsert",
        type:"GET",
        dataType:"jsonp",
        jsonp:"callback",
        data:{
            isbn:isbn,
            title:title,
            author:author,
            price: price,
            date:date,
            page:page,
            translator:translator,
            supplement:supplement,
            publisher:publisher,
            imgurl:imgurl
        },
        success:function (result) {
            alert("입력 성공");
            tr.empty();

        },
        error:function () {
            alert("입력 실패");
        }
    });
}