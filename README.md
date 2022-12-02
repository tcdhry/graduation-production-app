# 卒業制作用

***react versions***
```bat
npx create-react-app@5.0.1 pgr-frontend --template typescript

npm install react-router-dom@6.4.4
npm install @types/react-router-dom@5.3.3
npm install axios@1.2.0
npm install redux@4.2.0
npm install react-redux@8.0.5
npm install @types/react-redux@7.1.24
npm install scss@0.2.4
npm install react-markdown@8.0.4
npm install react-cookie@4.1.1
npm install react-ace@10.1.0
npm install query-string@7.1.2
npm install react-icons@4.7.1
npm install @reduxjs/toolkit@1.9.1
```
他package.json参照



***_commit&push.bat***
```bat
set /p commit_msg=
git add .
git commit -m "%date:~2,2%%date:~5,2%%date:~8,2%h %commit_msg%"
git push
timeout /t 180
```