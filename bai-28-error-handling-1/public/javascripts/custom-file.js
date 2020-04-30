const upload = document.getElementById("avatar-input");
const label = document.getElementById("avatar-label");
const avatar = document.getElementById("avatar");

function previewImage(upload, preview) {
  var reader = new FileReader();
  reader.onload = () => {
    preview.src = reader.result;
  };
  reader.readAsDataURL(upload.files[0]);
}

upload.addEventListener("change", event => {
  let content = "Choose avatar";
  const { value } = event.target;
  if (value !== "") {
    content = value.split("\\").pop();
    previewImage(event.target, avatar);
  } else {
    avatar.src = "";
  }

  label.textContent = content;
});
