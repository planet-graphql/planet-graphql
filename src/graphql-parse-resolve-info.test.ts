import {
  graphql,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLScalarType,
  GraphQLSchema,
} from 'graphql'
import { Kind } from 'graphql/language'
import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from './graphql-parse-resolve-info'

const query = `
  query Test($include: Boolean!, $exclude: Boolean!) {
    allPosts {
      edges {
        cursor @include(if: $include)
        node {
          ...PostDetails
          author: personByAuthorId {
            firstPost {
              ...PostDetails
            }
            friends {
              nodes {
                ...PersonDetails
              }
              totalCount @include(if: $include)
              pageInfo @skip(if: $exclude) {
                startCursor
              }
            }
          }
        }
      }
    }
  }
  fragment PersonDetails on Person {
    id
    ...MorePersonDetails @include(if: $include)
    lastName @include(if: false)
    bio @skip(if: true)
  }
  fragment MorePersonDetails on Person {
    name
    firstName
  }
  fragment PostDetails on Post {
    id
    headline
    headlineTrimmed @skip(if: $exclude)
    author: personByAuthorId {
      ...PersonDetails
    }
  }
`

const Cursor = new GraphQLScalarType({
  name: 'Cursor',
  serialize: String,
  parseValue: String,
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) {
      throw new Error('Can only parse string values')
    }
    return ast.value
  },
})

const PageInfo = new GraphQLObjectType({
  name: 'PageInfo',
  fields: {
    startCursor: {
      type: Cursor,
    },
  },
})

const Person: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    bio: {
      type: GraphQLString,
    },
    firstPost: {
      type: Post,
    },
    friends: {
      type: PersonConnection,
    },
  }),
})

const PersonEdge = new GraphQLObjectType({
  name: 'PersonEdge',
  fields: {
    cursor: {
      type: Cursor,
    },
    node: {
      type: Person,
    },
  },
})

const PersonConnection = new GraphQLObjectType({
  name: 'PersonConnection',
  fields: {
    edges: {
      type: new GraphQLList(PersonEdge),
    },
    nodes: {
      type: new GraphQLList(Person),
    },
    pageInfo: {
      type: PageInfo,
    },
    totalCount: {
      type: GraphQLInt,
    },
  },
})

const Post = new GraphQLObjectType({
  name: 'Post',
  fields: {
    personByAuthorId: {
      type: Person,
    },
    id: {
      type: GraphQLString,
    },
    headline: {
      type: GraphQLString,
    },
    headlineTrimmed: {
      type: GraphQLString,
    },
  },
})

const PostEdge = new GraphQLObjectType({
  name: 'PostEdge',
  fields: {
    cursor: {
      type: Cursor,
    },
    node: {
      type: Post,
    },
  },
})

const PostsConnection = new GraphQLObjectType({
  name: 'PostsConnection',
  fields: {
    edges: {
      type: new GraphQLList(PostEdge),
    },
  },
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    allPosts: {
      type: new GraphQLNonNull(PostsConnection),
      resolve(parent, args, context, resolveInfo) {
        // FIXME: delete any
        const parsedResolveInfoFragment: any = parseResolveInfo(resolveInfo)
        const simplifiedFragment = simplifyParsedResolveInfoFragmentWithType(
          parsedResolveInfoFragment,
          resolveInfo.returnType,
        )
        context.test({
          parsedResolveInfoFragment,
          simplifiedFragment,
        })
        return []
        // ...
      },
    },

    // ...
  },
})

const Schema = new GraphQLSchema({
  query: Query,
})

test('basic', async () => {
  let result: any
  await graphql({
    schema: Schema,
    source: query,
    variableValues: {
      include: true,
      exclude: false,
    },
    contextValue: {
      test: (_result: any) => (result = _result),
    },
  })
  expect(result.parsedResolveInfoFragment).toMatchSnapshot()
  expect(result.simplifiedFragment).toMatchSnapshot()
})

test('directives', async () => {
  let result: any
  await graphql({
    schema: Schema,
    source: query,
    variableValues: {
      include: false,
      exclude: true,
    },
    contextValue: {
      test: (_result: any) => (result = _result),
    },
  })
  expect(result.parsedResolveInfoFragment).toMatchSnapshot()
  expect(result.simplifiedFragment).toMatchSnapshot()
})
