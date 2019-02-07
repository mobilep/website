# mobile-practice-landing

- npm i
- bower i 

- gulp - build dist folder
- gulp serve:dist --prod
- gulp serve  --- devel

##
./g watch


## Deploy
From website repository directory
1. ./g build --production
2. rsync -avh dist/ ../mobilep.github.io/ --delete --exclude .git --exclude CNAME --exclude .DS_Store --exclude .gitignore --exclude "Mobile\ Practice\ Setup*"
3. Then commit & push from mobilep.github.io 

