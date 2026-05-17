use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("LeakGuard CaseDesk — {}", name)
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            // Start maximized for a desktop app feel
            window.maximize().unwrap_or(());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running LeakGuard CaseDesk");
}
