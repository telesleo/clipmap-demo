import React, { useState } from 'react';
import styles from './blog-post.module.css';

export default function BlogPost() {
  const [post] = useState({
    title: 'This is the title of the post',
    author: 'John Map',
    date: '20/04/2024',
    content: [
      {
        type: 'text',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in leo sit amet lorem efficitur viverra. Nam bibendum erat id gravida placerat. Etiam efficitur ex a tempor semper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus vestibulum risus id mi porttitor tincidunt. Suspendisse vel nunc at neque tempus rutrum. Proin congue leo quis risus efficitur, sed ullamcorper felis pretium. In mauris eros, tempor in augue ac, pellentesque laoreet eros. Aliquam viverra lectus id nisi posuere pellentesque.',
      },
      {
        type: 'image',
        content: '/images/clipmap-logo.png',
      },
      {
        type: 'text',
        content:
          'Nulla tristique nunc ut dolor dignissim blandit. Maecenas et dolor condimentum, sagittis elit vel, bibendum dui. Nam eros nisl, fermentum at orci eu, gravida consequat mi. Nulla facilisi. Nam malesuada est ac commodo condimentum. Ut mollis leo ligula, et sagittis ligula scelerisque eget. Vivamus sit amet est nec quam eleifend iaculis sit amet sit amet odio. Fusce sit amet nibh eros. Suspendisse in ultricies nisi, auctor ultrices mi. Duis et felis sit amet ex vestibulum suscipit. Aenean finibus felis quis eros fermentum rhoncus. Pellentesque nec sodales felis, ut luctus erat. Suspendisse efficitur varius augue, sit amet sagittis justo porttitor sit amet. Nam sem est, suscipit at sodales et, rhoncus ut enim.',
      },
      {
        type: 'text',
        content:
          'Maecenas faucibus at libero id dictum. Nullam leo leo, ornare ut velit at, efficitur elementum odio. Aenean posuere urna quis velit maximus, eu varius sapien tristique. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed luctus massa in odio auctor, quis cursus nibh condimentum. Duis lacinia magna in turpis pellentesque tempor at ac sem. Vestibulum eget interdum est. Nunc varius varius volutpat. Quisque vitae mi vulputate, rutrum tellus quis, lacinia lacus. Nam pulvinar magna lacinia arcu tempus pretium. Integer mollis turpis magna, vitae ornare mi porta id. Sed pharetra sit amet justo vitae ultrices. Aliquam dignissim ligula eu ex auctor, eget hendrerit ante venenatis. Aenean eu nisi in purus mollis laoreet.',
      },
    ],
  });

  return (
    <div id={styles['blog-post']}>
      {post && (
        <div id={styles.container}>
          <section>
            <h1 id={styles.title}>{post.title}</h1>
            <div id={styles['author-and-date']}>
              <h3 id={styles.author}>
                Escrito por:{' '}
                <span id={styles['author-name']}>{post.author}</span>
              </h3>
              <h3 id={styles.date}>{post.date}</h3>
            </div>
          </section>
          <section id={styles.content}>
            {post.content.map((contentPiece) => {
              if (contentPiece.type === 'text') {
                return (
                  <p className={styles.text} key={contentPiece.content}>
                    {contentPiece.content}
                  </p>
                );
              }
              if (contentPiece.type === 'image') {
                return (
                  <img
                    className={styles.image}
                    key={contentPiece.content}
                    src={contentPiece.content}
                    alt=""
                  />
                );
              }
              return null;
            })}
          </section>
        </div>
      )}
    </div>
  );
}
