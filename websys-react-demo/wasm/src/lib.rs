mod quick_sort;
mod user_faker;
use wasm_bindgen::prelude::*;
static mut USERS: Vec<user_faker::User> = Vec::new();

#[wasm_bindgen]
pub fn render_users() -> () {
    let window: web_sys::Window = web_sys::window().expect("No global `window` exists");
    let document: web_sys::Document = window.document().expect("should have a document on window");

    let user_list_element: web_sys::Element = document
        .get_element_by_id("user_list")
        .expect("an element with id user_list must exist");

    // Clear inner html
    user_list_element.set_inner_html("");
    unsafe {
        for user in &USERS {
            // Create li containing the user
            let user_li = document.create_element("li").unwrap();

            // Create attribute elements
            let first_name_span = document.create_element("span").unwrap();
            let last_name_span = document.create_element("span").unwrap();

            // Fill the span elements with data
            first_name_span.set_inner_html(&user.first_name);
            last_name_span.set_inner_html(&user.last_name);

            // Add attributes to the li element
            user_li.append_child(&first_name_span).unwrap();
            user_li.append_child(&last_name_span).unwrap();
            // Add the user div to the app list
            user_list_element.append_child(&user_li).unwrap();
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
            USERS.sort_by(|a, b| {
                a.first_name
                    .to_lowercase()
                    .cmp(&b.first_name.to_lowercase())
            });
        },
        Implementation::QuickSort => unsafe {
            quick_sort::quick_sort(&mut USERS, cmp);
        },
    }
}

/// Initializes a user list.
///
#[wasm_bindgen]
pub fn init() {
    let window: web_sys::Window = web_sys::window().expect("No global `window` exists");
    let document: web_sys::Document = window.document().expect("should have a document on window");

    let app_element: web_sys::Element = document
        .get_element_by_id("App")
        .expect("an element with id app must exist");

    // Create user list element
    let user_list_element: web_sys::Element = document.create_element("ul").unwrap();
    user_list_element.set_id("user_list");
    app_element.append_child(&user_list_element).unwrap();
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
