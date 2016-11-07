$( document ).ready(function() {
	isSession();
});

function isSession() {
	$.ajax({
		url:"http://localhost:8080/book/checkSession",
		type:"GET",
		dataType:"jsonp",
		jsonp:"callback",
		success:function (result) {
			console.log(result.id);

			if(result.id==null){
				console.log("세션 없음");

			}else{
				console.log("세션 존재함");
				console.log(result.id);

				$("#mytoggle").text(result.id);
			}
		},
		error:function () {
			consol.log("세션 점검 실패");
		}
	});
}

$(function(){

	$("tbody > tr > td:nth-child(2) > a").click(function () {
		$('div.modal').modal();
	});

})


/*
 *
 * 로그아웃
 *
 * */
$("#go_logout").on("click", function () {

	$.ajax({
		url:"http://localhost:8080/book/bookLogout",
		type:"GET",
		dataType:"jsonp",
		jsonp:"callback",
		success:function (result) {
			console.log(result);
			if(result==true){
				alert("로그아웃 및 세션종료 성공");
				$(location).attr('href', "index.html");

			}else{
				alert("세션종료 실패");
			}
		},
		error:function () {
			alert("로그아웃 실패");
		}
	});

});


/*
 *
 * 회원가입
 *
 * */
$("#join").on("click", function () {

	var id=$("[name=id]").val();
	var pw=$("[name=pw]").val();
	var pw_re=$("[name=pw_re]").val();

	if(id==""){
		alert("아이디를 입력해주세요");
	}else if(pw==""){
		alert("비밀번호를 입력해주세요");
	}else if(pw_re==""){
		alert("비밀번호를 다시 한번 더 입력해주세요");
	}else{
		if(pw==pw_re){
			$.ajax({
				url:"http://localhost:8080/book/bookJoin",
				type:"GET",
				dataType:"jsonp",
				jsonp:"callback",
				data:{
					id : id,
					pw: pw
				},
				success:function (result) {

					if (result == true) {

					alert("회원가입 성공");
					$(location).attr('href', "index.html");
					}
					else{
						alert("아이디가 중복됩니다.");
					}


				},
				error:function () {
					alert("회원가입 실패");
				}
			});

		}else{
			alert("비밀번호를 확인해주세요!");
		}
	}
});



/*
 *
 * 로그인
 *
 * */
$("#login").on("click", function () {

	var id=$("[name=id]").val();
	var pw=$("[name=pw]").val();

	if(id==""){
		alert("아이디를 입력해주세요");
	}else if(pw==""){
		alert("비밀번호를 입력해주세요");
	}else{

		$.ajax({
			url:"http://localhost:8080/book/bookLogin",
			type:"GET",
			dataType:"jsonp",
			jsonp:"callback",
			data:{
				id : id,
				pw: pw
			},
			success:function (result) {

				if(result==false){
					alert("아이디와 비밀번호를 확인해주세요");
				}
				else{
					alert("로그인 성공");
					$(location).attr('href', "list.html?id="+id);
				}
			},
			error:function () {
				alert("로그인 실패");
			}
		});


	}
});



/*
 *
 * 리스트 출력
 *
 * */
function searchBook() {
	if(event.keyCode == 13){

		$.ajax({
			url: "http://localhost:8080/book/bookList",
			type: "GET",
			dataType: "jsonp",
			jsonp: "callback",
			data: {
				keyword : $("#keyword").val()
			},
			success: function(result){


				$("#myTbody").empty();

				var a_isbn;
				var a_title;
				var a_author;
				var a_price;
				var a_base64;

				for(var i=0 ; i<result.length ; i++) {

					a_isbn=result[i].isbn;
					a_title=result[i].title;
					a_author=result[i].author;
					a_price=result[i].price;
					a_base64=result[i].base64;
					a_rent=result[i].rent;



					var tr = $("<tr></tr>").attr("data-isbn", a_isbn);
					var title = $("<td></td>").text(a_title);
					var author = $("<td></td>").text(a_author);
					var price = $("<td></td>").text(a_price);
					var img = $("<img />").attr("src", a_base64);
					var img_td = $("<td></td>").append(img);
					var btn_delete = $("<input />").attr("type", "button").attr("class", "btn btn-default").attr("value", "삭제");

					var delete_td = $("<td></td>").append(btn_delete);

					var btn_update = $("<input />").attr("type", "button").attr("class", "btn btn-default").attr("value", "수정");
					var update_td = $("<td></td>").append(btn_update);

					var datail = $("<button></button>").attr("class", "btn btn-default").attr("data-target", "#"+a_isbn).attr("data-toggle", "modal").text("상세보기");
					var detail_td = $("<td></td>").append(datail);

					var rent=$("<input />").attr("type", "button").attr("value", "대여가능").attr("disabled", false).attr("class", "btn btn-success").attr("name",result[i].isbn);

					var rent_name=result[i].rent;

					if(result[i].rent!=null){
						rent.attr("class", "btn btn-danger").attr("value", "대여중").attr("disabled", true).attr("value", "대여중 by "+rent_name);
					}


					var rent_td = $("<td></td>").append(rent);

					tr.append(img_td);
					tr.append(title);
					tr.append(author);
					tr.append(price);
					tr.append(delete_td);
					tr.append(update_td);
					tr.append(detail_td);
					tr.append(rent_td);



					$("#myTbody").append(tr);






					/*
					*
					* 대여
					*
					* */
					rent.on("click", function (){

						var id=$("#mytoggle").text();
						var now=$(this);
						/*
						*
						* 책 대여 여부 확인
						*
						* */
						$.ajax({

							url: "http://localhost:8080/book/isRent",
							type: "GET",
							dataType: "jsonp",
							jsonp: "callback",
							data: {
								id : id
							},
							success: function (result) {

								if(result==false){
									alert("대여 가능");

									if(confirm("대여하시겠습니까?")){

										var isbn=now.parent().parent().attr("data-isbn");
										var id=$("#mytoggle").text();

										console.log("isbn : "+isbn +" / id : "+id);

										$.ajax({

											url: "http://localhost:8080/book/bookRent",
											type: "GET",
											dataType: "jsonp",
											jsonp: "callback",
											data: {
												isbn: isbn,
												id : id
											},
											success: function (result) {
												alert("대여 성공");
												now.attr("class", "btn btn-danger").attr("value", "대여중 by "+id).attr("disabled", true);

											},
											error: function () {
												alert("대여 실패");
											}
										});
									}

								}
								else{
									alert("대여 불가능. 이미 대여중입니다.");
								}
							},
							error: function () {
								alert("대여 가능 여부 검사 실패");
							}
						});

					});


					/*
					 *
					 * 삭제
					 *
					 * */
					btn_delete.on("click", function () {


						var isbn = $(this).parent().parent().attr("data-isbn");
						var tr = $(this).parent().parent();

						$.ajax({

							url: "http://localhost:8080/book/bookDelete",
							type: "GET",
							dataType: "jsonp",
							jsonp: "callback",
							data: {
								isbn: isbn
							},
							success: function (result) {
								alert("삭제 성공");
								tr.empty();

							},
							error: function () {
								alert("삭제 실패");
							}
						});


					});



					/*
					*
					* 수정
					*
					* */
					btn_update.on("click", function () {

						var title = $(this).parent().parent().find("td:nth-child(2)").text();
						var title_updatebox = $("<input/>").attr("type", "text").attr("size", "80").val(title);

						var author = $(this).parent().parent().find("td:nth-child(3)").text();
						var author_updatebox = $("<input/>").attr("type", "text").attr("size", "40").val(author);

						var price = $(this).parent().parent().find("td:nth-child(4)").text();
						var price_updatebox = $("<input/>").attr("type", "text").val(price);

						var now = $(this);

							if(now.attr("value")=="수정"){

								$(this).parent().parent().find("td:nth-child(2)").text("");
								$(this).parent().parent().find("td:nth-child(2)").append(title_updatebox);


								$(this).parent().parent().find("td:nth-child(3)").text("");
								$(this).parent().parent().find("td:nth-child(3)").append(author_updatebox);


								$(this).parent().parent().find("td:nth-child(4)").text("");
								$(this).parent().parent().find("td:nth-child(4)").append(price_updatebox);
								//$(this).parent().parent().find("[type=button]").attr("disabled", "disabled");

								now.attr("value", "수정 완료");

							}else if(now.attr("value")=="수정 완료"){
								var isbn = $(this).parent().parent().attr("data-isbn");
								var title = $(this).parent().parent().find("td:nth-child(2) > input").val();
								var author = $(this).parent().parent().find("td:nth-child(3) > input").val();
								var price = $(this).parent().parent().find("td:nth-child(4) > input").val();

								var tr = $(this).parent().parent();

								console.log(isbn+" / "+title + " / " + author + " / "+ price);

								$.ajax({
									url: "http://localhost:8080/book/bookUpdate",
									type: "GET",
									dataType: "jsonp",
									jsonp: "callback",
									data: {
										isbn: isbn,
										title: title,
										author: author,
										price: price

									},
									success: function (result) {

										if(result==true){

											alert("수정 성공");
											now.attr("value", "수정");


											tr.find("td:nth-child(2)").empty();
											tr.find("td:nth-child(2)").text(title);

											tr.find("td:nth-child(3)").empty();
											tr.find("td:nth-child(3)").text(author);

											tr.find("td:nth-child(4)").empty();
											tr.find("td:nth-child(4)").text(price);
										}

										else{
											alert("수정 fail");
										}


									},
									error: function () {
										alert("수정 실패");
									}

								});

							}





					});




					/*
					 *
					 * 상세보기
					 *
					 * */
					datail.on("click", function () {

						var isbn = $(this).parent().parent().attr("data-isbn");

						var modal=$("<div></div>").attr("class", "modal fade").attr("id", isbn);
						var modal_dialog=$("<div></div>").attr("class", "modal-dialog");
						var modal_content=$("<div></div>").attr("class", "modal-content");
						var modal_header=$("<div></div>").attr("class","modal-header");
						var close_btn=$("<button></button>").attr("type", "button").attr("class", "close").attr("data-dismiss","modal").attr("id", "modal_close").text("x");
						var header_text=$("<h4></h4>").attr("class", "modal-title").text("상세보기");

						modal_header.append(close_btn);
						modal_header.append(header_text);

						var modal_body=$("<div></div>").attr("class", "modal-body");

						var modal_table=$("<table id='modal_table'></table>");

						var modal_tr1=$("<tr></tr>");
						var modal_tr2=$("<tr></tr>");
						var modal_tr3=$("<tr></tr>");
						var modal_tr4=$("<tr></tr>");
						var modal_tr5=$("<tr></tr>");
						var modal_tr6=$("<tr></tr>");
						var modal_tr7=$("<tr></tr>");
						var modal_tr8=$("<tr></tr>");
						var modal_tr9=$("<tr></tr>");
						var modal_tr10=$("<tr></tr>");

						var modal_img=$("<img/>");
						var modal_td1=$("<td rowspan='9'></td>");
						var modal_td1_1=$("<td></td>");
						var modal_td2=$("<td></td>");
						var modal_td3=$("<td></td>");
						var modal_td4=$("<td></td>");
						var modal_td5=$("<td></td>");
						var modal_td6=$("<td></td>");
						var modal_td7=$("<td></td>");
						var modal_td8=$("<td></td>");
						var modal_td9=$("<td></td>");




						var modal_comment_title_tr=$("<tr><td></td></tr>").text("서평 보기 및 작성");

						var modal_comment=$("<input/>").attr("type", "text").attr("class", "col-md-10").attr("id", "modal_comment").attr("placeholder", "comment").attr("size", "20");

						var modal_comment_btn=$("<input />").attr("type", "button").attr("class", "col-md-2").attr("id", "modal_comment_btn").attr("value", "입력");
						var modal_comment_div=$("<div></div>");
						var modal_td10=$("<td colspan='2'></td>");


						modal_comment_div.append(modal_comment);
						modal_comment_div.append(modal_comment_btn);

						modal_td10.append(modal_comment_div);

						var table;

						modal_td1.append(modal_img);
						modal_tr1.append(modal_td1);
						modal_tr1.append(modal_td1_1);
						modal_tr2.append(modal_td2);
						modal_tr3.append(modal_td3);
						modal_tr4.append(modal_td4);
						modal_tr5.append(modal_td5);
						modal_tr6.append(modal_td6);
						modal_tr7.append(modal_td7);
						modal_tr8.append(modal_td8);
						modal_tr9.append(modal_td9);

						modal_tr10.append(modal_td10);

						modal_table.append(modal_tr1);
						modal_table.append(modal_tr2);
						modal_table.append(modal_tr3);
						modal_table.append(modal_tr4);
						modal_table.append(modal_tr5);
						modal_table.append(modal_tr6);
						modal_table.append(modal_tr7);
						modal_table.append(modal_tr8);
						modal_table.append(modal_tr9);
						modal_table.append(modal_comment_title_tr);
						modal_table.append(modal_tr10);

						modal_body.append(modal_table);

						modal_content.append(modal_header);
						modal_content.append(modal_body);

						modal_dialog.append(modal_content);
						modal.append(modal_dialog);

						$(this).parent().append(modal);


						/*
						*
						* 상세보기 불러오기
						*
						* */

						$.ajax({
							url: "http://localhost:8080/book/bookDetail",
							type: "GET",
							dataType: "jsonp",
							jsonp: "callback",
							data: {
								isbn: isbn
							},
							success: function (result) {
								mytitle=result.title;
								myauthor=result.author;
								myprice=result.price;
								mybase64=result.base64;
								mypage=result.page;
								mydate=result.date;
								mypublisher=result.publisher;
								mysupplement=result.supplement;
								mytranslator=result.translator;

								console.log(mypage);

								$("#modal_table > tbody > tr:nth-child(1) > td:nth-child(1) > img").attr("src", mybase64);
								$("#modal_table > tbody > tr:nth-child(1) > td:nth-child(2)").text(isbn);
								$("#modal_table > tbody > tr:nth-child(2) > td").text("mytitle : "+mytitle);
								$("#modal_table > tbody > tr:nth-child(3) > td").text("myauthor : "+myauthor);
								$("#modal_table > tbody > tr:nth-child(4) > td").text("myprice : "+myprice);

								$("#modal_table > tbody > tr:nth-child(5) > td").text("date : "+mydate);
								$("#modal_table > tbody > tr:nth-child(6) > td").text("page : "+mypage);
								$("#modal_table > tbody > tr:nth-child(7) > td").text("publisher : "+mypublisher);
								$("#modal_table > tbody > tr:nth-child(8) > td").text("supplement : "+mysupplement);
								$("#modal_table > tbody > tr:nth-child(9) > td").text("translator : "+mytranslator);


								/*
								*
								* 서평 목록 불러오기
								*
								* */
								$.ajax({
									url: "http://localhost:8080/book/commentShowAll",
									type: "GET",
									dataType: "jsonp",
									jsonp: "callback",
									data: {
										isbn: $("#modal_table > tbody > tr:nth-child(1) > td:nth-child(2)").text()
									},
									success: function (result) {
										for(var j=0 ; j<result.length ; j++) {

											id = result[j].id;
											comment = result[j].comment;

											var modal_comment_list_tr=$("<tr></tr>");
											var modal_comment_list_idtd=$("<td></td>").text(id);
											var modal_comment_list_texttd=$("<td></td>").text(comment);

											modal_comment_list_tr.append(modal_comment_list_idtd).append(modal_comment_list_texttd);

											$("#modal_table").append(modal_comment_list_tr);




										}
									},
									error: function () {
										alert("서평 불러오기 실패")
									}

								});
								/*
								 *
								 * 서평 목록 불러오기
								 * 끝!!!
								 *
								 * */

							},
							error: function () {
								alert("상세보기 실패")
							}

						});


						/*
							 *
							 * 모달창 닫을때마다
							 * 모달 div없애주고
							 * fade div없애주기
							 *
							 * */
							close_btn.on("click", function () {

								close_btn.parent().parent().parent().parent().remove();
								$("body > div:last-child").remove();

							});



							/*
							 *
							 * 서평입력
							 *
							 * */
							modal_comment_btn.on("click", function () {

								var myisbn="";

								console.log("서평입력으로 컴컴컴");

								var mycomment = $(this).parent().find("[type=text]").val();
								var myid=$("#mytoggle").text();

								myisbn = $("#modal_table > tbody > tr:nth-child(1) > td:nth-child(2)").text();


								console.log(mycomment+" / "+myisbn +" / " + myid);

								$.ajax({

									url: "http://localhost:8080/book/commentInsert",
									type: "GET",
									dataType: "jsonp",
									jsonp: "callback",
									data: {
										comment: mycomment,
										isbn:myisbn,
										id:myid
									},
									success: function (result) {
										alert("코멘트 입력 성공");

										myisbn="";


										var tr=$("<tr></tr>");
										var name_td=$("<td></td>").text(myid);
										var contents_td=$("<td></td>").text(mycomment);
										tr.append(name_td).append(contents_td);

										$("#modal_table").append(tr);
										$("#modal_comment").val("");


									},
									error: function () {
										alert("코멘트 입력 실패");
										myisbn="";
									}
								});
								myisbn="";

							});
					});


				}

				/*
				 *
				 * 페이징 처리
				 *
				 * */




				$("div.pager").remove();
				$('table.paginated').each(function() {
					var currentPage = 0;
					var numPerPage = 5;
					var $table = $(this);

					$table.bind('repaginate', function() {
						$table.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
					});

					var numRows = $table.find('tbody tr').length;
					var numPages = Math.ceil(numRows / numPerPage);
					var $pager = $('<div class="pager"></div>');

					for (var page = 0; page < numPages; page++) {
						$('<span class="page-number"></span>').text(page + 1+"  ").css("font-size", "25px").bind('click', {newPage: page}, function(event) {

							currentPage = event.data['newPage'];
							$table.trigger('repaginate');
							$(this).addClass('active').siblings().removeClass('active');

						}).appendTo($pager).addClass('clickable');
					}

					$pager.insertBefore($table).find('span.page-number:first').addClass('active');


					$("#Tbody > tr").tabs(".pager > span", {initialIndex: 1, effect: 'fade', fadeOutSpeed: 400});


					$table.find('th').removeClass('sorted-asc').removeClass('sorted-desc');

					if (sortDirection == 1) {
						$header.addClass('sorted-asc');
					}
					else {
						$header.addClass('sorted-desc');
					}
					$table.alternateRowColors();
					$table.trigger('repaginate');
				});




			},
			error:function(){
				alert("error");
			}
		});



	}
}


function mySort() {

	var data = $("#myTbody>tr").get();

	data.sort(function (a, b) {
		var first = $(a).children("td").eq(3).text();
		var second = $(b).children("td").eq(3).text();

		if(first < second) return -1;
		if(first > second) return 1;

		return 0;
	});

	$.each(data, function (idx, row) {
		$("myTbody").append(row);
	});
}

var base64 = null;

/*
*
* 도서 입력
*
* */
$(function () {

	// jQuery의 이벤트 처리는 on() method 이용
	$("#btn_insert").click (function () {

		$.ajax({

			url:"http://localhost:8080/book/bookinsert",
			type:"GET",
			dataType:"jsonp",
			jsonp:"callback",
			data:{
				isbn:$("#isbn").val(),
				title:$("#title").val(),
				author:$("#author").val(),
				price: $("#price").val(),
				date:$("#date").val(),
				page:$("#page").val(),
				translator:$("#translator").val(),
				supplement:$("#supplement").val(),
				publisher:$("#publisher").val(),
				imgurl:$("#imgurl").val(),
				imgbase64:base64
			},
			success:function (result) {
				alert("입력 성공");

				$(location).attr('href', "list.html");
			},
			error:function () {
				alert("입력 실패");
			}
		});
	});

});


function fileInfo(f){
	var file = f.files; // files 를 사용하면 파일의 정보를 알 수 있음

	if(file[0].size > 1024 * 1024){
		alert('1MB 이하 이미지를 업로드 해주세요');
		return;
	}

	var reader = new FileReader();

	reader.onload = function(rst){
		$('#img_box').html('<img src="' + rst.target.result + '">');

		base64=rst.target.result;
		console.log(base64);
	}
	reader.readAsDataURL(file[0]); // 파일을 읽는다, 배열이기 때문에 0 으로 접근
}

/*
 *
 * 서평 검색
 *
 *  */
$("#search_comment").on("click", function () {

	$("#myTbody").empty();
	var text=$(this).parent().find("[type=text]").val();

	$.ajax({
		url:"http://localhost:8080/book/commentSearch",
		type:"GET",
		dataType:"jsonp",
		jsonp:"callback",
		data:{
			text : text
		},
		success:function (result) {

			var id;
			var title;
			var author;
			var publisher;
			var comment;
			var seq;

			var myId=$("#mytoggle").text();

			for(var i=0 ; i<result.length ; i++) {
				seq=result[i].seq;
				id=result[i].id;
				title=result[i].title;
				author=result[i].author;
				publisher=result[i].publisher;
				comment=result[i].comment;

				var tr=$("<tr></tr>");

				var seq_id=$("<td></td>").text(seq);
				seq_id.css("display", "none");
				var id_td=$("<td></td>").text(id);
				var title_td=$("<td></td>").text(title);
				var author_td=$("<td></td>").text(author);
				var publisher_td=$("<td></td>").text(publisher);
				var comment_td=$("<td></td>").text(comment);

				var del_td;

				tr.append(seq_id);
				tr.append(id_td);
				tr.append(title_td);
				tr.append(author_td);
				tr.append(comment_td);
				tr.append(publisher_td);

				$("#myTbody").append(tr);

				if(myId==result[i].id){

					del_td=$("<td></td>");
					var del_btn=$("<input>").attr("type","button").attr("value", "delete").attr("id", "del_btn");

					del_td.append(del_btn);
					tr.append(del_td);

					del_btn.on("click", function () {

						var seq_tt=$(this).parent().parent().find("td:nth-child(1)");
						var seq=seq_tt.text();
						console.log("seq : "+seq);

						$.ajax({
							url: "http://localhost:8080/book/commentDelete",
							type: "GET",
							dataType: "jsonp",
							jsonp: "callback",
							data: {
								seq: seq
							},
							success: function (result) {
								alert("삭제 성공");
								seq_tt.parent().empty();
							},
							error: function () {
								alert("삭제 실패");
							}
						});


					});
				}
			}
		},
		error:function () {
			alert("검색 실패");
		}
	});

});


/*
*
* 내 서평 검색
*
* */

$("#showMyComment").on("click", function () {

	$("#myTbody").empty();

	var myid=$("#mytoggle").text();
	console.log("Comment의 id : "+myid);

	$.ajax({
		url:"http://localhost:8080/book/myCommentCall",
		type:"GET",
		dataType:"jsonp",
		jsonp:"callback",
		data:{
			id : myid
		},
		success:function (result) {

			var id;
			var title;
			var author;
			var publisher;
			var comment;
			var seq;

			for(var i=0 ; i<result.length ; i++) {

				seq=result[i].seq;
				id=result[i].id;
				title=result[i].title;
				author=result[i].author;
				publisher=result[i].publisher;
				comment=result[i].comment;


				var tr=$("<tr></tr>");

				var seq_id=$("<td></td>").text(seq);
				seq_id.css("display", "none");
				var id_td=$("<td></td>").text(id);
				var title_td=$("<td></td>").text(title);
				var author_td=$("<td></td>").text(author);
				var publisher_td=$("<td></td>").text(publisher);
				var comment_td=$("<td></td>").text(comment);

				var del_td=$("<td></td>");
				var del_btn=$("<input>").attr("type","button").attr("value", "delete").attr("id", "del_btn");

				del_td.append(del_btn);

				tr.append(seq_id);
				tr.append(id_td);
				tr.append(title_td);
				tr.append(author_td);
				tr.append(comment_td);
				tr.append(publisher_td);
				tr.append(del_td);

				$("#myTbody").append(tr);

				del_btn.on("click", function () {

					var seq_tt=$(this).parent().parent().find("td:nth-child(1)");
					var seq=seq_tt.text();
					console.log("seq : "+seq);

					$.ajax({

						url: "http://localhost:8080/book/commentDelete",
						type: "GET",
						dataType: "jsonp",
						jsonp: "callback",
						data: {
							seq: seq
						},
						success: function (result) {
							alert("삭제 성공");
							seq_tt.parent().empty();
						},
						error: function () {
							alert("삭제 실패");
						}
					});
				});
			}
		},
		error:function () {
			alert("내 서평 접속 실패");
		}
	});

});


/*
 *
 * 회원ID로 대여상태 조회
 *
 */
$("#current_status").on("click", function (){

	$("#myTbody").empty();

	var id=$("#current_status").parent().find("[type=text]").val();
	var myid=$("#mytoggle").text();


	$.ajax({
		url: "http://localhost:8080/book/currentStatus",
		type: "GET",
		dataType: "jsonp",
		jsonp: "callback",
		data: {
			id: id
		},
		success: function (result) {


			alert("대여 목록 출력 성공");

			var isbn = result.isbn;
			var title = result.title;
			var author = result.author;
			var base64 = result.base64;
			var publisher = result.publisher;


			var tr = $("<tr></tr>").attr("data-isbn", isbn);
			var title_td = $("<td></td>").text(title);
			var author_td = $("<td></td>").text(author);
			var publisher_td = $("<td></td>").text(publisher);

			var img = $("<img />").attr("src", base64);
			var img_td = $("<td></td>").append(img);

			tr.append(img_td);
			tr.append(title_td);
			tr.append(author_td);
			tr.append(publisher_td);
			tr.append(id);

			$("#myTbody").append(tr);

			var myreturn;

			if(id==myid){

				myreturn=$("<input />").attr("type", "button").attr("class", "btn btn-warning").attr("value", "반납");
				var return_td=$("<td></td>").append(myreturn);

				tr.append(return_td);
			}




			/*
			*
			* 반납 버튼 이벤트 처리
			*
			* */
			myreturn.on('click', function () {


				$.ajax({
					url: "http://localhost:8080/book/returnBook",
					type: "GET",
					dataType: "jsonp",
					jsonp: "callback",
					data: {
						id: id
					},
					success: function (result) {
						if(result==true){
							alert("반납 성공");
							myreturn.attr("class", "btn btn-success").attr("value", "대여");


							$(location).attr('href', "list.html");

						}else{
							alert("반납 실패");
						}
					},
					error: function () {
						alert("반납 시도 실패");
					}
				});
			});


		},

		error: function () {
			alert("대여 목록 출력 실패");
		}
	});
});


