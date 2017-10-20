open Owl
open Owl_types
open Neural 
open Neural.S

let get_input_data img_name = 
  let _, _, _, img = LoadImage.img_to_owl img_name in
  let shape = Dense.Ndarray.S.shape img in
  let shape = Array.append [|1|] shape in
  let img = Dense.Ndarray.S.reshape img shape in 
  
  (* Preprocessing input image data to range [-1, 1] *)
  let img = Dense.Ndarray.S.div_scalar img 255. in 
  let img = Dense.Ndarray.S.sub_scalar img 0.5  in
  let img = Dense.Ndarray.S.mul_scalar img 2.   in
  img

let decode_predictions ?(top=5) preds = 
  let h = Owl_utils.marshal_from_file "imagenet1000.dict" in 
  let tp = Dense.Matrix.S.top preds top in 
  Printf.printf "\nTop %d Predictions:\n" top;
  Array.iteri (fun i x -> 
    Printf.printf "Prediction #%d (%.2f%%) : " i ((Dense.Matrix.S.get preds x.(0) x.(1)) *. 100.);
    Printf.printf "%s\n" (Hashtbl.find h x.(1)) 
  ) tp

let to_json ?(top=5) preds = 
  let assos = Array.make top "" in 
  let h = Owl_utils.marshal_from_file "imagenet1000.dict" in 
  let tp = Dense.Matrix.S.top preds top in 

  Array.iteri (fun i x -> 
    let cls  = Hashtbl.find h x.(1) in 
    let prop = Dense.Matrix.S.get preds x.(0) x.(1) in 
    let p = "{\"class\":\"" ^ cls ^ "\", \"prop\": " ^ (string_of_float prop) ^ "}," in 
    Array.set assos i p 
  ) tp;

  let str  = Array.fold_left (^) "" assos in 
  let str  = String.sub str 0 ((String.length str) - 1) in
  let json = "[" ^ str ^ " ]" in 
  Printf.printf "%s" json;
  json

let _ = 
  let img_name = Sys.argv.(1) in
  let nn  = Graph.load "inception_owl.network" in 
  let img = get_input_data img_name in 
  let preds = Graph.model nn img in
  (* decode_predictions preds; *)
  to_json preds


