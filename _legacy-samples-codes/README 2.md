# nodejs API practice 

* 본 api는 [http://nodeapi.myspaceti.me:8001/api](http://nodeapi.myspaceti.me:8001/api) 에서 아래와 같은 명세로 작동합니다. (https 아님 주의)
* nodejs로 구현한 API를 3tier Layered Architecture로 구성했습니다. 
* 개발 순서상 TDD로 구현하지는 않았지만, Jest 기반 테스트 코드를 연습하기위해 77개의 테스트코드를 작성했습니다.

----

* 적용 순서
``` bash

git clone https://github.com/SpaceTime52/study_Architecture_Pattern.git
cd study_Architecture_Pattern
npm install
## .env 생성하셔야 합니다. 

## 서버 실행 : 둘 중 하나를 사용하시면 됩니다. 
npm start
(또는) node server.js

## 단위 및 통합 테스트 
npm test

```


## ERD : Entity Relationship Diagram

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/08c62cea-a311-4ef0-9579-5e2fe16def2c/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220805%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220805T010127Z&X-Amz-Expires=86400&X-Amz-Signature=a98404c2aaf18bb4ddfedc2ef0ed5b15e648fb3f3129635bff494db538294cfc&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)



| 기능               | API URL                 | Method | request(가져 갈 데이터)                                                                 | response(서버로부터 받아올 데이터)                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------ | ----------------------- | ------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 회원 가입          | /api/signup             | POST   | { "nickname": "Developer", "password": "1234", "confirm": "1234"}                       | { "message": "회원 가입에 성공하였습니다."}                                                                                                                                                                                                                                                                                                                                                                       |
| 로그인             | /api/login              | POST   | { "nickname": "Developer", "password": "1234"}                                          | { "token": "eyJhbGciO......."}                                                                                                                                                                                                                                                                                                                                                                                    |
| 게시글 작성        | /api/posts              | POST   | { "title": "안녕하세요 게시글 제목입니다.", "content": "안녕하세요 content 입니다."}    | { "message": "게시글 작성에 성공하였습니다."}                                                                                                                                                                                                                                                                                                                                                                     |
| 게시글 조회        | /api/posts              | GET    | -                                                                                       | { "data": [ { "postId": 2, "userId": 1, "nickname": "Developer", "title": "안녕하세요 2번째 게시글 제목입니다.", "createdAt": "2022-07-25T07:45:56.000Z", "updatedAt": "2022-07-25T07:45:56.000Z", "likes": 0 }, { "postId": 1, "userId": 1, "nickname": "Developer", "title": "안녕하세요 게시글 제목입니다.", "createdAt": "2022-07-25T07:45:15.000Z", "updatedAt": "2022-07-25T07:45:15.000Z", "likes": 1 } ]} |
| 게시글 상세 조회   | /api/posts/:postId      | GET    | -                                                                                       | { "data": { "postId": 2, "userId": 1, "nickname": "Developer", "title": "안녕하새요 수정된 게시글 입니다.", "content": "안녕하세요 content 입니다.", "createdAt": "2022-07-25T07:45:56.000Z", "updatedAt": "2022-07-25T07:52:09.000Z", "likes": 0}                                                                                                                                                                |
| 게시글 수정        | /api/posts/:postId      | PUT    | { "title": "안녕하새요 수정된 게시글 입니다.", "content": "안녕하세요 content 입니다."} | { "message": "게시글을 수정하였습니다."}                                                                                                                                                                                                                                                                                                                                                                          |
| 게시글 삭제        | /api/posts/:postId      | DELETE | -                                                                                       | { "message": "게시글을 삭제하였습니다."}                                                                                                                                                                                                                                                                                                                                                                          |
| 댓글 생성          | /api/comments/:postId   | POST   | { "comment": "안녕하세요 댓글입니다."}                                                  | { "message": "댓글을 작성하였습니다."}                                                                                                                                                                                                                                                                                                                                                                            |
| 댓글 목록 조회     | /api/comments/:postId   | GET    | -                                                                                       | { "data": [ { "commentId": 2, "userId": 1, "nickname": "Developer", "comment": "안녕하세요 2번째 댓글입니다.", "createdAt": "2022-07-25T07:54:24.000Z", "updatedAt": "2022-07-25T07:54:24.000Z" }, { "commentId": 1, "userId": 1, "nickname": "Developer", "comment": "안녕하세요 댓글입니다.", "createdAt": "2022-07-25T07:53:31.000Z", "updatedAt": "2022-07-25T07:53:31.000Z" } ]}                             |
| 댓글 수정          | /api/comments/:commetId | PUT    | { "comment": "수정된 댓글입니다."}                                                      | { "message": "댓글을 수정하였습니다."}                                                                                                                                                                                                                                                                                                                                                                            |
| 댓글 삭제          | /api/comments/:commetId | DELETE | -                                                                                       | { "message": "댓글을 삭제하였습니다."}                                                                                                                                                                                                                                                                                                                                                                            |
| 좋아요 게시글 조회 | /api/posts/like         | GET    | -                                                                                       | { "data": [ { "postId": 4, "userId": 1, "nickname": "Developer", "title": "안녕하세요 4번째 게시글 제목입니다.", "createdAt": "2022-07-25T07:58:39.000Z", "updatedAt": "2022-07-25T07:58:39.000Z", "likes": 1 } ]}                                                                                                                                                                                                |
| 게시글 좋아요      | /api/posts/:postId/like | PUT    | -                                                                                       | { "message": "게시글의 좋아요를 등록하였습니다."},{ "message": "게시글의 좋아요를 취소하였습니다."}                                                                                                                                                                                                                                                                                                               |


