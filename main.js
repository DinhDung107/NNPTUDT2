async function GetData() {
    try {
        let res = await fetch('http://localhost:3000/posts')
        if (res.ok) {
            let posts = await res.json();
            let bodyTable = document.getElementById('body-table');
            bodyTable.innerHTML = '';
            for (const post of posts) {
                bodyTable.innerHTML += convertObjToHTML(post)
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function GetComments() {
    try {
        let res = await fetch('http://localhost:3000/comments')
        if (res.ok) {
            let comments = await res.json();
            let commentBodyTable = document.getElementById('comment-body-table');
            if (commentBodyTable) {
                commentBodyTable.innerHTML = '';
                for (const comment of comments) {
                    commentBodyTable.innerHTML += convertCommentToHTML(comment)
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function Save() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("views_txt").value;

    if (id) {
        // Update existing
        let getItem = await fetch('http://localhost:3000/posts/' + id);
        if (getItem.ok) {
            await fetch('http://localhost:3000/posts/' + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    views: views
                })
            })
        }
    } else {
        // Create new with Auto ID
        // Fetch all posts to find max ID
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();
        let maxId = 0;
        if (posts.length > 0) {
            // Assume IDs are numeric strings
            maxId = Math.max(...posts.map(p => parseInt(p.id) || 0));
        }
        let newId = (maxId + 1).toString();

        await fetch('http://localhost:3000/posts', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: newId,
                title: title,
                views: views,
                isDeleted: false
            })
        })
    }
    GetData();
    return false;
}

async function SaveComment() {
    let id = document.getElementById("comment_id_txt").value;
    let text = document.getElementById("comment_text_txt").value;
    let postId = document.getElementById("comment_post_id_txt").value;

    if (id) {
        // Update existing
        await fetch('http://localhost:3000/comments/' + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                postId: postId
            })
        })
    } else {
        // Create new with Auto ID (Logic similar to Post or server generated if strictly following json-server but user asked for logic)
        // User requirements only specified Auto ID for Posts ("Làm ID tự tăng bằng với maxId +1 khi tạo (mới khi tạo mới thì bỏ trống ID)").
        // I will assume simple ID generation for comments or rely on json-server default if string is fine, but to be safe lets use same logic or Random. 
        // Let's use similar maxId logic for consistency.
        let res = await fetch('http://localhost:3000/comments');
        let comments = await res.json();
        let maxId = 0;
        if (comments.length > 0) {
            maxId = Math.max(...comments.map(c => parseInt(c.id) || 0));
        }
        let newId = (maxId + 1).toString();

        await fetch('http://localhost:3000/comments', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: newId,
                text: text,
                postId: postId
            })
        })
    }
    GetComments();
    return false;
}


function convertObjToHTML(post) {
    let style = post.isDeleted ? 'style="text-decoration: line-through; color: gray;"' : '';
    return `<tr ${style}>
    <td>${post.id}</td>
    <td>${post.title}</td>
    <td>${post.views}</td>
    <td>
        ${!post.isDeleted ? `<input type='submit' value='Delete' onclick='Delete(${post.id})'>` : 'Deleted'}
    </td>
    </tr>`
}

function convertCommentToHTML(comment) {
    return `<tr>
    <td>${comment.id}</td>
    <td>${comment.text}</td>
    <td>${comment.postId}</td>
    <td>
        <input type='submit' value='Delete' onclick='DeleteComment(${comment.id})'>
        <input type='submit' value='Edit' onclick='LoadComment(${comment.id})'> 
    </td>
    </tr>`
}

async function LoadComment(id) {
    let res = await fetch('http://localhost:3000/comments/' + id);
    if (res.ok) {
        let comment = await res.json();
        document.getElementById("comment_id_txt").value = comment.id;
        document.getElementById("comment_text_txt").value = comment.text;
        document.getElementById("comment_post_id_txt").value = comment.postId;
    }
}

async function Delete(id) {
    let res = await fetch('http://localhost:3000/posts/' + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: true
        })
    })
    if (res.ok) {
        GetData()
    }
    return false;
}

async function DeleteComment(id) {
    let res = await fetch('http://localhost:3000/comments/' + id, {
        method: "DELETE"
    })
    if (res.ok) {
        GetComments()
    }
    return false;
}

GetData();
GetComments();
