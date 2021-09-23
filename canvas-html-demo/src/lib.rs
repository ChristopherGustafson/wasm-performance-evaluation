use wasm_bindgen::prelude::*;
use web_sys::console;

// Called by our JS entry point to run the example
#[wasm_bindgen]
pub fn run() -> Result<(), JsValue> {
   
    // Use `web_sys`'s global `window` function to get a handle on the global
    // window object.
    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");
    // let body = document.body().expect("document should have a body");

    // Get list element from DOM
    let list_element = document.get_elements_by_class_name("collectionViewItems");

    match list_element.item(1) {
        
        // Found student list
        Some(name_list_element) => {
            console::log_1(&"Found list element in DOM".into());
            let student_rows = name_list_element.children();
            // A binary tree for storing the students, where the key is the student name, and the value is the html element for the student. Since the BTreeMap is sorted on keys while constructed, it will be sorted based on the student names
            let mut student_list: Vec<(String, web_sys::Element)> = Vec::new();

            // Push every student into students_vector
            for index in 0..student_rows.length() {
                match student_rows.item(index) {
                    Some(student) => {
                        match student.get_elements_by_class_name("roster_user_name").item(0) {
                            Some(student_name) => {
                                student_list.push((student_name.inner_html(), student));
                            },
                            None => console::log_1(&"Could not find student name".into()),
                        }
                    }, 
                    None => console::log_1(&"Could not find student row".into()),
                }
            };

            student_list.sort_by(|a, b| {
                a.0.to_lowercase().cmp(&b.0.to_lowercase())
            });
            // Append the elements in the sorted order of the Binary Tree, since we have stored references to the previous student nodes in the markup, these will be moved rather then deleted and added back.
            
            for student in student_list {
                name_list_element.append_child(&student.1)?;
            }
        },   
        // No name list found
        None => console::log_1(&"Could not find names list".into()),
    }
    Ok(())
}