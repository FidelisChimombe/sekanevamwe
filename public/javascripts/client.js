
var like;
var update_joke;
var update_comment;
var comment;
$(document).ready(function(){

  //jQuery.timeago(new Date());//programatically calculate timeago
//helps with time ago calculation

  $("time.timeago").timeago();
//remember html has a property data-extraproperty
  like= function(element){
    var id_s = element.value;//contains joke_id and user_id
    var joke_user_id=id_s.split(" ");
    try{
      var socket = io.connect("http://127.0.0.1:8080");
    }catch(e){
    }
    if(socket!==undefined){       
      socket.emit('like',{joke_id:joke_user_id[0],user_id:joke_user_id[1]});
    }
  }

  update_joke=function(){
    try{
      var socket = io.connect("http://127.0.0.1:8080");
    }catch(e){

    }

    if(socket!==undefined){
      socket.on('like_update',function(data){
        var element=document.getElementById("likes_"+data.joke._id);
        element.innerHTML=data.joke.likes.length + " likes";
      });
    }
  }

  comment=function(){
    var comment_field=document.getElementById('joke-comment-content');
    if(comment_field.value.length<1){  
      comment_field.setCustomValidity("Can't post empty comment");
    }else{
      var content=$("#joke-comment-content").val();
      var joke_id =$("#joke-comment-id").val();
      var author_id=$("#joke-author-id").val();
      var username = $("#joke-comment-username").val();
       $("#joke-comment-content").val("");
      try{
        var socket = io.connect("http://127.0.0.1:8080");
      }catch(e){
      }
      if(socket!==undefined){
        socket.emit('comment',{content:content,joke_id:joke_id,author_id:author_id,username:username});
      }
    }   
    
  }

  update_comment=function(){
    try{
      var socket = io.connect("http://127.0.0.1:8080");
    }catch(e){

    }

    if(socket!==undefined){

      //remember to update comments after each commenting
      socket.on('new_comment',function(data){ 
        console.log(document);       
         var new_comment_row = document.createElement('tr');
         new_comment_row.setAttribute('class','joke-comments');
         var td_1=document.createElement('td');
         var td_2=document.createElement('td');
         var div_1 =document.createElement('div');
         var img =document.createElement('img');
         img.setAttribute('class','profile_picture');
         img.setAttribute('src',"/images/profile_pic.png");
         div_1.appendChild(img);
         var div_2 =document.createElement('div');
         div_2.setAttribute('class','div_2_styling');  
         div_2.textContent=data.username;
         td_1.appendChild(div_1);
         td_1.appendChild(div_2);
         var div_3 =document.createElement('div');
         div_3.textContent = data.comment.content;
         var div_4 =document.createElement('div');
         div_4.setAttribute('class','inner-joke');         
         td_2.appendChild(div_3);
         td_2.appendChild(div_4);        
         var time =document.createElement('time');
         time.setAttribute('class','timeago');   
         time.setAttribute('datetime',data.comment.created_at);        
         time.textContent =jQuery.timeago(data.comment.created_at);
         div_4.appendChild(time);
         new_comment_row.appendChild(td_1);
         new_comment_row.appendChild(td_2);
         var table=document.getElementById("table-comments");
         table.insertBefore(new_comment_row,table.firstChild);//appends on top of the table
         //increasing the comments in the show page      
         var comment_element=document.getElementById("show_"+data.joke._id);
         comment_element.innerHTML=data.joke.comments.length + " comments";     
        
      });
    }
  }



update_joke();
update_comment();
  



});


