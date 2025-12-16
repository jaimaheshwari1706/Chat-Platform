@echo off
echo Pushing Chat Platform Frontend to Git...

cd /d "d:\Chat-Platform"

git add .
git commit -m "Fix WebSocket messaging - messages now display in UI"
git push origin main

echo Frontend pushed successfully!
pause