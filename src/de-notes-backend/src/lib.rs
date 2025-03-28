use std::cell::RefCell;
use std::collections::HashMap;
use ic_cdk::storage;
use candid::Principal;
use ic_cdk::api::{caller, time};

#[derive(Default, candid::CandidType, serde::Deserialize, Clone)]
struct Note {
    timestamp: u64,
    content: String,
    pinned: bool,
}

#[derive(Default, candid::CandidType, serde::Deserialize)]
struct State {
    notes: HashMap<Principal, Vec<Note>>,
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[ic_cdk::update]
fn add_note(content: String) -> u64 {
    let user = caller();
    STATE.with(|state| {
        let mut mut_state = state.borrow_mut();
        if mut_state.notes.len() < 300 && content.len() < 1000{
            let timestamp = time();
            let note = Note{timestamp, content, pinned: false};
            mut_state.notes.entry(user).or_insert_with(Vec::new).insert(0, note);
            return timestamp;
        }
        return 0;
    })
}

#[ic_cdk::query]
fn get_notes() -> Vec<Note> {
    let user = caller();
    STATE.with(|state| {
        state.borrow().notes.get(&user).cloned().unwrap_or_default()
    })
}

#[ic_cdk::update]
fn edit_note(timestamp: u64, new_content: String, pinned: bool) -> bool {
    if new_content.len() < 1000{
        let user = caller();
        STATE.with(|state| {
            if let Some(notes) = state.borrow_mut().notes.get_mut(&user) {
                if let Some(index) = notes.iter().position(|note| note.timestamp == timestamp) {
                    let mut note = notes.remove(index);                
                    note.pinned = pinned;
                    if note.content == new_content {
                        notes.insert(index, note);
                    }
                    else {
                        note.content = new_content;
                        note.timestamp = time();
                        notes.insert(0, note);
                    }
                    return true;
                }
            }
            false
        })
    }
    else {
        false
    }
}



#[ic_cdk::update]
fn delete_note(timestamp: u64) -> bool {
    let user = caller();
    STATE.with(|state| {
        if let Some(notes) = state.borrow_mut().notes.get_mut(&user) {
            notes.retain(|note| note.timestamp != timestamp);
            return true;
        }
        false
    })
}

#[ic_cdk::pre_upgrade]
fn save_state() {
    let _ = STATE.with(|state| storage::stable_save((&*state.borrow(),)));
}

#[ic_cdk::post_upgrade]
fn restore_state() {
    if let Ok((saved_state,)) = storage::stable_restore::<(State,)>() {
        STATE.with(|state| *state.borrow_mut() = saved_state);
    }
}
