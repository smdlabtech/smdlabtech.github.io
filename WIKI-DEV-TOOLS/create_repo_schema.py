import os
import re
import ast
from pathlib import Path

def extract_info_from_file(file_path):
    """
    Extracts relevant information (docstrings, functions, classes) from a Python file,
    and content for CSS and JavaScript files, while ignoring specified file types.
    
    Args:
        file_path (str): The full path to the file.
        
    Returns:
        dict: A dictionary containing the extracted information.
    """
    ignored_extensions = ['.gitattributes', '.gitignore', 'LICENSE', '.md', '.txt', '.db', '.pdf']
    _, file_extension = os.path.splitext(file_path)
    
    if file_extension.lower() in ignored_extensions:
        return {}  # Return an empty dictionary for ignored files
    
    info_dict = {'type': file_extension}
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            if file_path.endswith('.py'):
                tree = ast.parse(file.read(), filename=file_path)
                for node in ast.walk(tree):
                    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                        name = node.name
                        docstring = ast.get_docstring(node)
                        if docstring:
                            info_dict[name] = docstring.strip()
                        else:
                            info_dict[name] = "No docstring found."
            elif file_path.endswith(('.css', '.js')):
                content = file.read()
                info_dict['content'] = content
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
    return info_dict

def generate_documentation_md(directory_path, output_file):
    """
    Generates a Markdown file containing documentation for all files in a directory,
    ignoring specified directories and file types.
    
    Args:
        directory_path (str): The path of the directory containing the files.
        output_file (str): The path of the output Markdown file.
    """
    excluded_dirs = [".", "venv", ".env_win", ".git", "__pycache__", "_data", "data", "data_lcl_pdf", "assets", "archives", "_markdown_modules_courses", "assets", "Bills GCP", "Google Cloud Skills Boost", "PPT", "Quiz", "Quiz prompts", "archives_py", "_topics", "archive_exam_topics", "archives_markdown", "archives_quiz_json", "archives_topics", "_quiz", "DEV - TOOLS"]
    excluded_files = [".gitignore", ".DS_Store", "LICENSE", "gen_topics_with_images.py"]
    
    with open(output_file, 'w', encoding='utf-8') as md_file:
        md_file.write("# Dev App Documentation\n\n")
        
        file_counter = 0
        
        for root, dirs, files in os.walk(directory_path):
            # Ignore directories that start with a dot or match one of the excluded patterns
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in excluded_dirs]
            
            for file in files:
                if file in excluded_files:
                    continue
                
                file_path = os.path.join(root, file)
                info_dict = extract_info_from_file(file_path)
                if info_dict:
                    file_counter += 1
                    filename = os.path.basename(file)
                    md_file.write(f"## File {file_counter}: {filename} ({info_dict['type']})\n")
                    # md_file.write(f"**Location**: `{filename}`\n")
                    for key, value in info_dict.items():
                        if key != 'type':
                            md_file.write(f" - **{key}** : {value}\n")
                    md_file.write("\n")
                    
                    

######################################
# Repo schema generation
######################################
def generate_repo_schema(source_dir):
    # add docstring in english
    """
    Browse the source directory and all subdirectories.
    Returns a repository schema listing all Markdown and Python files.
    """

    repo_schema = []
    
    # Parcours du répertoire source et de ses sous-dossiers
    for root, dirs, files in os.walk(source_dir):
        # Filtrer uniquement les fichiers .md et .py
        markdown_files = [f for f in files if f.endswith('.md')]
        python_files = [f for f in files if f.endswith('.py')]
        
        # Ajouter les fichiers trouvés dans le schéma
        if markdown_files or python_files:
            repo_schema.append(f"📂 {os.path.relpath(root, source_dir)}")
            for f in markdown_files:
                repo_schema.append(f"   📄 {f} (Markdown)")
            for f in python_files:
                repo_schema.append(f"   📄 {f} (Python)")
    
    return repo_schema


def save_schema_to_file(schema, output_file):
    # add docstring in english 
    """
    Save the repository schema to a text file.
    """
    with open(output_file, 'w') as f:
        f.write("\n".join(schema))

# Exemple d'utilisation
source_directory = '/chemin/vers/ton/repertoire/source'
schema = generate_repo_schema(source_directory)

# Sauvegarder le schéma dans un fichier texte
output_file = 'schema_repo.txt'
save_schema_to_file(schema, output_file)

print(f"Le schéma du dépôt a été généré et sauvegardé dans {output_file}")

#-------------------------#
if __name__ == "__main__":
#-------------------------#

    # Get the current directory of the script
    current_dir = Path(__file__).resolve().parent
    docs_directory_path = os.path.join(current_dir, "_docs")
    
    # Check if the "docs" directory exists
    if not os.path.isdir(docs_directory_path):
        print(f"Error: The '_docs' directory does not exist at '{docs_directory_path}'.")
        exit(1)  # Exit the program with an error status
    
    # Define the full path for the output file within the "docs" directory
    output_file_path = os.path.join(docs_directory_path, "dev_documentations.md")
    generate_documentation_md(current_dir, output_file_path)
