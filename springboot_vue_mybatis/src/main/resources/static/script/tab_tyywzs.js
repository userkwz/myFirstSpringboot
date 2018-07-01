$(document).ready(function(){
  // 在这里写你的代码...

			setTimeout(function(){
					alert(11)
					var lineData1 = [{
					name: '1800 年',
					data: [107, 31, 635, 203, 2]
				}]
				var lineData2 = [{
					name: '1800 年',
					data: [107, 31, 635, 203, 2]
				}, {
					name: '1900 年',
					data: [133, 156, 947, 408, 6]
				}]
//				bar('#ajsls',lineData1);
				line('#ajslt');
				column('#ajblhjt');				
//				bar('#gyajsls',lineData2);
				$('.date_but div').click(function(){
					$('.date_but_click').removeClass('date_but_click');
					$(this).addClass('date_but_click');
				})
				},500)

			});