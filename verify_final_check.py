import os

def verify_files():
    # Check CSS
    css_path = "docs/assets/css/styleGYM.css"
    if os.path.exists(css_path):
        with open(css_path, "r") as f:
            css = f.read()
            if ".active-owner" in css and "var(--primary)" in css and "#eff6ff" in css:
                print("CSS: Active owner colors updated to blue.")
            else:
                print("CSS: FAILED to update active owner colors.")

            if ".admin-sidebar-tab" in css and "width: 40px" in css and "transition:" in css:
                 print("CSS: Sidebar tab animation styles present.")
            else:
                 print("CSS: FAILED sidebar tab animation styles.")
    else:
        print(f"CSS: {css_path} NOT FOUND")

    # Check JS
    js_path = "docs/assets/js/utils.js"
    if os.path.exists(js_path):
        with open(js_path, "r") as f:
            js = f.read()
            if "text-blue-600 font-black text-[10px] uppercase tracking-widest mb-4\">Active Project" in js:
                print("JS: Active Project header color updated to blue.")
            else:
                print("JS: FAILED Active Project header color.")

            if "hover:border-blue-500" in js and "owner-item" in js:
                print("JS: Sidebar item hover color updated to blue.")
            else:
                print("JS: FAILED sidebar item hover color.")
    else:
        print(f"JS: {js_path} NOT FOUND")

if __name__ == "__main__":
    verify_files()
