var myDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
  url: '/upload',
  maxFilesize: 100,
  paramName: "uploadfile",
  maxThumbnailFilesize: 10,
  parallelUploads: 1,
  autoProcessQueue: true,
  thumbnailWidth: 100,
  thumbnailHeight:100,
  // previewTemplate: previewTemplate,
  //previewsContainer: "#previews", // Define the container to display the previews
  //clickable: ".fileinput-button" // Define the element that should be used as click trigger to select files.
});

myDropzone.on("success", function(file, response) {
  alert(response)
  //document.querySelector("#total-progress").style.opacity = "0";
});
