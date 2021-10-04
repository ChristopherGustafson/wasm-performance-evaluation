use fake::faker::name::en::{FirstName, LastName};
use fake::Fake;

pub struct User {
    pub first_name: String,
    pub last_name: String,
}

pub fn generate_user() -> User {
    let user = User {
        first_name: FirstName().fake(),
        last_name: LastName().fake(),
    };

    return user;
}
