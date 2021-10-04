mod quick_sort;
mod user_faker;
use wasm_bindgen::prelude::*;
static mut USERS: Vec<user_faker::User> = Vec::new();

#[wasm_bindgen]
pub fn render_users() -> () {
    let window: web_sys::Window = web_sys::window().expect("No global `window` exists");
    let document: web_sys::Document = window.document().expect("should have a document on window");

    let user_list_element: web_sys::Element = document
        .get_elements_by_class_name("grid-canvas grid-canvas-top grid-canvas-left")
        .item(0)
        .expect("an element with id user_list must exist");

    // Set inner HTML
    user_list_element.set_inner_html("");
    unsafe {
        for (i, user) in USERS.iter().enumerate() {
            // Create li containing the user
            let user_div = document.create_element("div").unwrap();
            user_div.set_class_name("ui-widget-content slick-row even");
            let offset = i * 25;
            user_div
                .set_attribute("style", &format!("top:{}px", offset))
                .unwrap();

            // Create attribute elements
            let first_name_div = document.create_element("div").unwrap();
            let last_name_div = document.create_element("div").unwrap();
            first_name_div.set_class_name("slick-cell l0 r0");
            last_name_div.set_class_name("slick-cell l1 r1");

            // Fill the span elements with data
            first_name_div.set_inner_html(&user.first_name);
            last_name_div.set_inner_html(&user.last_name);

            // Add attributes to the li element
            user_div.append_child(&first_name_div).unwrap();
            user_div.append_child(&last_name_div).unwrap();
            // Add the user div to the app list
            user_list_element.append_child(&user_div).unwrap();
        }
    }
}

#[wasm_bindgen]
pub fn generate_users(user_amount: u32) {
    unsafe {
        USERS = (0..user_amount)
            .map(|_x| user_faker::generate_user())
            .collect();
    };
}

#[wasm_bindgen]
pub enum Implementation {
    Native,
    QuickSort,
}

#[wasm_bindgen]
pub fn sort_users(implementation: Implementation) {
    fn cmp(a: &user_faker::User, b: &user_faker::User) -> core::cmp::Ordering {
        return a.first_name.cmp(&b.first_name);
    }

    match implementation {
        Implementation::Native => unsafe {
            USERS.sort_by(|a, b| a.first_name.cmp(&b.first_name));
        },
        Implementation::QuickSort => unsafe {
            quick_sort::quick_sort(&mut USERS, cmp);
        },
    }
}

#[cfg(test)]
mod tests {
    use crate::quick_sort::quick_sort;
    #[test]
    fn test_quick_sort() {
        let mut vec: Vec<i32> = vec![2, 4, 3, 1, 5];
        fn cmp(a: &i32, b: &i32) -> core::cmp::Ordering {
            a.cmp(&b)
        }
        quick_sort(&mut vec, cmp);
        assert_eq!(vec, vec![1, 2, 3, 4, 5]);
    }
}
