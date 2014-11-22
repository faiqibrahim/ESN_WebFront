<?php // You need to add server side validation and better error handling here
//$postdata = file_get_contents("php://input");
//$files = json_decode($postdata);

header("Access-Control-Allow-Origin: *");
function make_thumb($src, $dest, $desired_width) {

	/* read the source image */
	$source_image = imagecreatefromjpeg($src);
	$width = imagesx($source_image);
	$height = imagesy($source_image);
	
	/* find the "desired height" of this thumbnail, relative to the desired width  */
	$desired_height = floor($height * ($desired_width / $width));
	
	/* create a new, "virtual" image */
	$virtual_image = imagecreatetruecolor($desired_width, $desired_height);
	
	/* copy source image at a resized size */
	imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);
	
	/* create the physical thumbnail image to its destination */
	imagejpeg($virtual_image, $dest);
}



$data = array();
if(true)
{  
	$error = false;
	$files = array();
	$uploaddir = './Data/';
	foreach($_FILES as $file)
	{
		if(move_uploaded_file($file['tmp_name'], $uploaddir .basename($file['name'])))
		{	$src='http://esn.com/Data/' .$file['name'];
			$thumb_path='./Data/Thumbs/' .$file['name'];
			array_push($files,$src);
			make_thumb($src,$thumb_path,800);
		}
		else
		{
		    $error = true;
		}
	}
	$data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
}
else
{
	$data = array('success' => 'Form was submitted', 'formData' => $_POST);
}
 
echo json_encode($data);
 
?>