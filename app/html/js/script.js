$(function() {
  let start_flg = 0;

  // renderer -> main
  args = ["Sample Message From Renderer"];
  $("#start-btn").on("click", function() {
    if (start_flg === 0) {
      const start_time = window.api.get_start_time(args);
      start_time.then((res, failres) => {
        $("#start-time").text(res);
      })
      $("#start-btn").css("display", "none");
      $(".time-container").css("margin-top", "1.2rem");
      start_flg = 1;
    }
  })

  // main -> renderer
  window.api.on("update_current_time", (event, message) => {
    $("#current-time").text(message);
  })

  window.api.on("update_elapssed_time", (event, message) => {
    if (start_flg === 1) {
      const hour = Math.floor(message/(60*60));
      const min  = Math.floor((message - (hour*60*60))/(60));
      const sec  = Math.ceil(message - (hour*60*60) - (min*60)); // 微妙に切り捨てられると１秒足りてなく見えるのでceilで切り上げる
      $("#elapssed-time").text(`${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`);
    }
  })
})