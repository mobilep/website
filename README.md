# mobile-practice-landing

- npm i
- bower i 

- gulp - build dist folder
- gulp serve:dist --prod
- gulp serve  --- devel


## Deploy
From website repository directory
gulp build --production
rsync -avh dist/ ../mobilep.github.io/ --delete --exclude .git --exclude CNAME --exclude .DS_Store


