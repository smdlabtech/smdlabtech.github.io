# Installer RubyInstaller (exemple avec Ruby 3.1.4)
$uri = "https://github.com/oneclick/rubyinstaller2/releases/download/RubyInstaller-3.1.4-1/rubyinstaller-devkit-3.1.4-1-x64.exe "
$output = "$env:TEMP\rubyinstaller.exe"
Invoke-WebRequest -Uri $uri -OutFile $output
Start-Process -Wait -FilePath $output -ArgumentList "/verysilent", "/dir=C:\Ruby31"

# Ajouter Ruby au PATH
$env:Path += ";C:\Ruby31\bin"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::Machine)

# Installer Bundler et Jekyll
gem install bundler
gem install jekyll

# Aller dans ton répertoire et lancer le serveur
cd "C:\Users\DASY\Downloads\DEV DOCS\smdlabtech.github.io"
bundle install
bundle exec jekyll serve