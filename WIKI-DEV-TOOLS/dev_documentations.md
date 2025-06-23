# Dev App Documentation

## File 1: app.py (.py)
 - **load_color_schemes** : Loads color schemes from a JSON file.

Args:
    directory (str): The path to the directory containing the JSON file.
    file_name (str): The name of the JSON file to load.

Returns:
    dict: A dictionary containing the color schemes.
          Returns an empty dictionary if the file is not found.

Raises:
    st.error: Displays an error in the Streamlit interface if the file is not found.
 - **load_json_file** : Loads JSON data from a file.

Args:
    file_path (str): The path to the JSON file.

Returns:
    dict: The JSON data.
    {} if the file is not found.
 - **generate_footer_html** : No docstring found.
 - **display_footer** : Displays a footer with gradient colors.

Args:
    left_color (str): The color of the left side of the footer.
    right_color (str): The color of the right side of the footer.
 - **generate_button_css** : No docstring found.
 - **apply_layout_css** : Applies CSS styles for layout based on the specified layout option.

Args:
    layout (str): The layout option ("Normal" or "Wide").
 - **display_html** : Displays HTML content from the specified file.

Args:
    file_name (str): The name of the HTML file to display.

Raises:
    FileNotFoundError: If the specified file is not found.
 - **apply_css** : Applies CSS styles from the specified file.

Args:
    file_name (str): The name of the CSS file to apply.

Raises:
    FileNotFoundError: If the specified file is not found.
 - **quiz_json** : Loads quiz data from a JSON file.

Args:
    filepath (str): The relative path to the JSON file.

Returns:
    dict: The quiz data.
 - **go_to_previous_page** : Navigates to the previous page in the navigation sequence.
 - **go_to_next_page** : Navigates to the next page in the navigation sequence.
 - **update_page_layout** : Updates the page layout in the session state.

Args:
    layout (str): The layout option ("Normal" or "Wide").
 - **start_timer** : Starts a countdown timer.

Args:
    duration (int): The duration of the timer in seconds.
    timer_placeholder (st.delta_generator.DeltaGenerator): The placeholder for displaying the timer.
 - **reset_filter** : Resets the user answers and timer states.
 - **validate_answers** : Validates user answers against correct answers and calculates the score.

Args:
    quiz_data (dict): The quiz data.
    user_answers (dict): User's answers where keys are question indices and values are lists of selected option indices.

Returns:
    tuple: A tuple containing correct answers count, total questions count, and user's score.
 - **show_final_message** : Displays the final message based on the quiz results.

Args:
    correct_answers (int): Number of correct answers.
    total_questions (int): Total number of questions.
    score (float): User's score.
 - **main** : No docstring found.

## File 2: app_data_loader.py (.py)
 - **load_files_json** : Loads the contents of a JSON file.

Args:
filepath (str): The path to the JSON file.

Returns:
dict: The contents of the JSON file in dictionary form.
 - **load_quiz_json** : Load questions and answers from a Markdown file.

Args:
file_path (str): The path to the Markdown file.

Returns:
dict: A dictionary containing the questions and their answers.
 - **load_quiz_markdown** : Load the content of a Markdown file for a specific _quiz.

Args: file_name (str): The name of the Markdown file to load.

Returns: str: The content of the Markdown file as a string.
 - **load_files_markdown** : Load the content of a Markdown file.

Args: file_name (str): The name of the Markdown file.

Returns: str: The content of the Markdown file as a string.

## File 3: app_styles.py (.py)
 - **styles_img** : Loads and displays an image in a Streamlit application.

Args:
image_file (str): Name of the image file to load.
caption (str): Optional caption to be displayed below the image.
use_column_width (bool): Whether or not to use column width for the image.
width (int): Image width in pixels.
height (int): Image height in pixels.
output_format (str): Image output format (e.g. 'PNG', 'JPEG').
 - **styles_css** : Loads and applies a CSS file to a Streamlit application.

Args:
css_file (str): Name of CSS file to load.
 - **styles_html** : Loads HTML content from the given file name.

Args:
file_name (str): Name of HTML file to load.

Returns:
str: HTML content as string.
 - **styles_js** : Loads JavaScript content from the given filename.

Args:
file_name (str): Name of JavaScript file to load.

Returns:
str: JavaScript content as string.
 - **styles_md** : Loads Markdown content from the given file name.

Args:
file_name (str): Name of Markdown file to load.

Returns:
str: Markdown content as string.
 - **display_markdown** : Display Markdown content in a Streamlit application.

Args:
file_name (str): Name of the Markdown file to load and display.

Returns:
None

## File 4: dev_generate_docs.py (.py)
 - **extract_info_from_file** : Extracts relevant information (docstrings, functions, classes) from a Python file,
and content for CSS and JavaScript files, while ignoring specified file types.

Args:
    file_path (str): The full path to the file.
    
Returns:
    dict: A dictionary containing the extracted information.
 - **generate_documentation_md** : Generates a Markdown file containing documentation for all files in a directory,
ignoring specified directories and file types.

Args:
    directory_path (str): The path of the directory containing the files.
    output_file (str): The path of the output Markdown file.

## File 5: aboutme.py (.py)
 - **create_clickable_image** : Crée un HTML pour une image cliquable qui redirige vers un lien donné.

:param image_path: Chemin vers l'image.
:param link: URL vers laquelle l'image redirige.
:param alt_text: Texte alternatif pour l'image.
:param style: Style CSS pour l'image.
 - **create_icon_link** : Crée un HTML pour une icône cliquable qui redirige vers un lien donné.

:param icon_class: Classe de l'icône (par exemple, "fab fa-linkedin").
:param link: URL vers laquelle l'icône redirige.
:param color: Couleur de l'icône.
:param size: Taille de l'icône (par exemple, "2x").
 - **page_aboutme** : No docstring found.

## File 6: home.py (.py)
 - **extract_image_links** : Attempts to extract image links from the Markdown content, considering the presence or absence of width attribute.
 - **load_and_encode_image** : Loads an image from the specified path and encodes it in Base64.
 - **insert_images_into_markdown** : Inserts Base64 encoded images into the Markdown content.
 - **display_markdown_with_images** : Reads the content of a Markdown file and inserts images.
 - **page_homepage** : No docstring found.

## File 7: quiz.py (.py)
 - **list_quiz_files** : Lists JSON files in a directory and its subdirectory.

Args:
    directory (str): The path to the directory containing quiz files.
    subdirectory (str): The subdirectory (theme/module) to list JSON files from.

Returns:
    list: A list of JSON files in the directory or subdirectory.
 - **list_themes** : Lists subdirectories in a directory.

Args:
    directory (str): The path to the directory containing themes.

Returns:
    list: A list of subdirectories (themes) in the directory.
 - **select_theme_module_and_quiz** : Allows user to select a theme, then a module within that theme, and then a quiz within that module.

Args:
    quiz_directory (str): The path to the directory containing quiz themes.

Returns:
    str: Path to the selected quiz file.
 - **display_quiz** : Displays a quiz and collects user answers.

Args:
    quiz_data (dict): The quiz data.

Returns:
    dict: User answers where keys are question indices and values are lists of selected option indices.
 - **reset_filter** : Resets the user answers and timer states.
 - **page_quiz** : Initializes and manages the display of a quiz within the Streamlit application.

This function loads quiz data from a specified JSON file entered by the user,
displays the selected quiz's questions, allows the user to answer the questions,
and collects the user's answers.

The user is prompted to enter the path to the JSON file containing the quiz data.
Once the file is loaded, they can choose among several quizzes available in the same directory.
After completing the quiz, the user's answers are returned for validation.

## File 8: review.py (.py)
 - **extract_image_links** : Attempts to extract image links from the Markdown content, considering the presence or absence of width attribute.
 - **load_and_encode_image** : Loads an image from the specified path and encodes it in Base64.
 - **insert_images_into_markdown** : Inserts Base64 encoded images into the Markdown content.
 - **display_markdown_with_images** : Reads the content of a Markdown file and inserts images.
 - **count_lines_in_file** : Returns the number of lines in a file.
 - **find_markdown_files** : Finds all Markdown files in the given directory and its subdirectories,
excluding 'footer.md' and 'header.md', and returns a list of tuples
containing the file name without extension, number of lines, and full file path.
 - **list_subdirectories** : Lists all subdirectories in a given directory, excluding specific folders.
 - **page_review** : Displays the review page with options to select a module/theme, subfolder, and Markdown file.

