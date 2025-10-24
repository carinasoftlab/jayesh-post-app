import { gql } from '@apollo/client'

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      createdAt
      author { id username }
    }
  }
`

export const ADD_POST = gql`
  mutation AddPost($title: String!, $content: String!) {
    addPost(title: $title, content: $content) {
      id
      title
      content
      createdAt
      author { id username }
    }
  }
`

export const REGISTER = gql`
  mutation Register($username:String!, $password:String!) {
    register(username:$username, password:$password) { id username }
  }
`

export const LOGIN = gql`
  mutation Login($username:String!, $password:String!) {
    login(username:$username, password:$password) { id username }
  }
`

export const LOGOUT = gql`
  mutation Logout { logout }
`

export const ME = gql`
  query Me { me { id username } }
`

export const MY_POSTS = gql`
  query MyPosts { myPosts { id title content createdAt } }
`

export const UPDATE_POST = gql`
  mutation UpdatePost($id:ID!, $title:String, $content:String) {
    updatePost(id:$id, title:$title, content:$content) { id title content createdAt }
  }
`

export const DELETE_POST = gql`
  mutation DeletePost($id:ID!) { deletePost(id:$id) }
`


