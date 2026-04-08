import os

def verify_files():
    # Check CSS
    with open("docs/css/styles.css", "r") as f:
        css = f.read()
        if ".active-owner" in css and "var(--primary)" in css and "#eff6ff" in css:
            print("CSS: Active owner colors updated to blue.")
        else:
            print("CSS: FAILED to update active owner colors.")

        if ".admin-sidebar-tab" in css and "width: 40px" in css and "transition:" in css:
             print("CSS: Sidebar tab animation styles present.")
        else:
             print("CSS: FAILED sidebar tab animation styles.")

    # Check JS
    with open("docs/js/utils.js", "r") as f:
        js = f.read()
        if "text-blue-600 font-black text-[10px] uppercase tracking-widest mb-4\">Active Project" in js:
            print("JS: Active Project header color updated to blue.")
        else:
            print("JS: FAILED Active Project header color.")

        if "hover:border-blue-500" in js and "owner-item" in js:
            print("JS: Sidebar item hover color updated to blue.")
        else:
            print("JS: FAILED sidebar item hover color.")

if __name__ == "__main__":
    verify_files()
