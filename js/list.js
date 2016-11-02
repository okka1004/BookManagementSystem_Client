function searchBook() {
	if(event.keyCode == 13){
		console.log("js에 드루와");

		$.ajax({
			url: "http://localhost:8080/book/bookList",
			type: "GET",
			dataType: "jsonp",
			jsonp: "callback",
			data: {
				keyword : $("#keyword").val()
			},
			success: function(result){

				for(var i=0 ; i<result.length ; i++){

					var tr= $("<tr></tr>").attr("data-isbn", result[i].isbn);
					var title= $("<td></td>").text(result[i].title);
					var author= $("<td></td>").text(result[i].author);
					var price= $("<td></td>").text(result[i].price);
					var img = $("<img />").attr("src", result[i].img);
					var img_td = $("<td></td>").append(img);
					var btn_delete=$("<input />").attr("type", "button").attr("value", "삭제");
					btn_delete.on("click", function(){

						//삭제 내용
						var isbn=$(this).parent().parent().attr("data-isbn");
						var tr=$(this).parent().parent();

						$.ajax({

							url:"http://localhost:8080/book/bookDelete",
							type:"GET",
							dataType:"jsonp",
							jsonp:"callback",
							data:{
								isbn:isbn
							},
							success:function (result) {
								alert("삭제 성공");
								tr.empty();

							},
							error:function () {
								alert("삭제 실패");
							}
						});



					});
					var delete_td=$("<td></td>").append(btn_delete);
					var btn_update=$("<input />").attr("type", "button").attr("value", "수정");
					btn_update.on("click", function(){

						var price=$(this).parent().parent().find("td:nth-child(4)").text();
						var updatebox=$("<input/>").attr("type", "text").val(price);

						//text박스에서 엔터 눌렀을 때 수정 실행
						updatebox.on("keyup", function () {
							if(event.keyCode==13){
								var isbn=$(this).parent().parent().attr("data-isbn");
								var price=$(this).val();
								var tr=$(this).parent().parent();


								$.ajax({
									url:"http://localhost:8080/book/bookUpdate",
									type:"GET",
									dataType:"jsonp",
									jsonp:"callback",
									data:{
											isbn:isbn,
											price:price
									},
									success:function (result) {
										alert("수정 성공");
										tr.find("td:nth-child(4)").empty();
										tr.find("td:nth-child(4)").text(price);

									},
									error:function () {
										alert("수정 실패");
									}

								});
							}
						});

						$(this).parent().parent().find("td:nth-child(4)").text("");
						$(this).parent().parent().find("td:nth-child(4)").append(updatebox);
						$(this).parent().parent().find("[type=button]").attr("disabled", "disabled");



					});
					var update_td=$("<td></td>").append(btn_update);

					tr.append(img_td);
					tr.append(title);
					tr.append(author);
					tr.append(price);
					tr.append(delete_td);
					tr.append(update_td);

					$("tbody").append(tr);

				}
			},
			error:function(){
				alert("error");
			}
		});
	}
}

function mySort() {



	var data = $("table").find("tbody>tr").get();

	data.sort(function (a, b) {
		var first = $(a).children("td").eq(3).text();
		var second = $(b).children("td").eq(3).text();

		if(first < second) return -1;
		if(first > second) return 1;

		return 0;
	});

	$.each(data, function (idx, row) {
		$("table").children("tbody").append(row);
	});
}

