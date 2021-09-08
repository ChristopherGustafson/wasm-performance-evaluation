mod user_faker;

use wasm_bindgen::prelude::*;

static mut USERS: Vec<user_faker::User> = Vec::new();

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

pub fn generate_users(user_amount: u32) {
    unsafe {
        USERS = (0..user_amount)
            .map(|_x| user_faker::generate_user())
            .collect();
    };
}

pub fn sort_users() {
    unsafe {
        USERS.sort_by(|a, b| {
            a.first_name
                .to_lowercase()
                .cmp(&b.first_name.to_lowercase())
        });
    };
}

pub fn handle_users(user_amount: u32) {
    generate_users(user_amount);
    sort_users();
    render_users();
}

/// Initializes a user list with a specified amount of users. Returns a callback to re-generate users.
///
/// ### Parameters
/// * `user_amount` - The amount of users to be generated and rendered.
///
/// ### Returns
/// A callback that works similar to this function but only re-generates the user list.
#[wasm_bindgen]
pub fn init(user_amount: u32) -> JsValue {
    let window: web_sys::Window = web_sys::window().expect("No global `window` exists");
    let document: web_sys::Document = window.document().expect("should have a document on window");

    let app_element: web_sys::Element = document
        .get_element_by_id("App")
        .expect("an element with id app must exist");

    // Create user list element
    let user_list_element: web_sys::Element = document.create_element("ul").unwrap();
    user_list_element.set_id("user_list");
    app_element.append_child(&user_list_element).unwrap();

    handle_users(user_amount);

    let on_change_user_amount_cb =
        Closure::wrap(
            Box::new(|new_user_amount| handle_users(new_user_amount)) as Box<dyn FnMut(u32) -> ()>
        );

    let ret = on_change_user_amount_cb.as_ref().clone();

    on_change_user_amount_cb.forget();
    return ret;
}
