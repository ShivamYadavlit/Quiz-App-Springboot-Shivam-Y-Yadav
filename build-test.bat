@echo off
echo Setting up environment...
set JAVA_HOME=C:\Program Files\Java\jdk-21
echo JAVA_HOME set to: %JAVA_HOME%

echo Changing to Quiz-App directory...
cd Quiz-App

echo Testing Maven build...
mvnw.cmd clean compile -DskipTests

pause