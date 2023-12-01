import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { getTodos, postTodo } from '../my-api'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}

function Todos() {
  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const query = useQuery('todos', getTodos)

  // Mutations
  const mutation = useMutation(postTodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('todos')
    },
  })

  return (
    <div>
      <ul>
        {query.data.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
import logo from './logo.svg';
import './App.css';
import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";


const posts = [
  { id: 1, name: "Post 1" },
  { id: 2, name: "Post 2" },
  { id: 3, name: "Post 3" },
  { id: 4, name: "Post 4" },
  { id: 5, name: "Post 5" }
];

function App() {
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(1000).then(() => [...posts]) ,
    refetchInterval: 10000
    // staleTime: 5000 // Promise.reject("error mes")
  })
 const queryClient = useQueryClient()
  
 const newPostMutation = useMutation({
    mutationFn: (title) => {
      const newPost = { id: Math.random(), name: title }; // Create a new post object
      const updatedPosts = [...posts, newPost]; // Create a new array with the updated posts
      wait(1000).then(() => {
        posts.push(newPost); // Mutating the original array (not recommended)
        queryClient.setQueryData(["posts"], updatedPosts); // Update the query data with the new array
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"], {exact: true});
    }
  });

  if(postsQuery.isLoading) return <h1>Loading...</h1>
  if(postsQuery.isError){
    return <pre>{JSON.stringify(postsQuery.error)}</pre>
  }
  return (
    <div className="App">
       
        {/* Render posts */}
        <div>
          {posts.map((post) => (
            <div key={post.id}>
              <h2>{post.name}</h2>
              {/* Additional post details can be displayed here */}
            </div>
          ))}
        </div>
        <button disabled={newPostMutation.isLoading} onClick={() => newPostMutation.mutate("new post")}> add posts</button>

    </div>
  );
}

function wait(duration){
  return new Promise(resolve => setTimeout(resolve, duration))
}

export default App;


// function App() {
//   const postsQuery = useQuery({
//     queryKey: ["posts"],
//     queryFn: () => wait(1000).then(() => [...posts])  // Promise.reject("error mes")
//   })
//  const queryClient = useQueryClient()
//  const newPostMutation = useMutation({
//   mutationFn: (title) => {
//     const newPost = { id: Math.random(), name: title }; // Create a new post object
//     const updatedPosts = [...posts, newPost]; // Create a new array with the updated posts
//     wait(1000).then(() => {
//       posts.push(newPost); // Mutating the original array (not recommended)
//       queryClient.setQueryData(["posts"], updatedPosts); // Update the query data with the new array
//     });
//   },
//   onSuccess: () => {
//     queryClient.invalidateQueries(["posts"]);
//   }
// });


//   if(postsQuery.isLoading) return <h1>Loading...</h1>
//   if(postsQuery.isError){
//     return <pre>{JSON.stringify(postsQuery.error)}</pre>
//   }
//   return (
//     <div className="App">
       
//         {/* Render posts */}
//         <div>
//           {posts.map((post) => (
//             <div key={post.id}>
//               <h2>{post.name}</h2>
//               {/* Additional post details can be displayed here */}
//             </div>
//           ))}
//         </div>
//         <button disabled={newPostMutation.isLoading} onClick={() => newPostMutation.mutate("new post")}> add posts</button>

//     </div>
//   );
// }

