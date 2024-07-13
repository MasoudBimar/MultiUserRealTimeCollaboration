# Multi-User Real-Time Collaboration App Creatingly

1\. The real-time collaboration is when multiple users are able to work together on the same document or project simultaneously such that any changes and updates that are being made will be reflected in real-time for all 

This is possible due to technologies such as WebSockets as well as server-side synchronization that provides real-time data exchange and communication.

Challenge 1 

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXeaYSM74IBb2VqWOjRAAt2PuzQ7QokAXOk0peybqyMaL_HBrt_bd42AeREphvDot7XUgMHUQ-rfewNFpuz8UNDBdDiscOGf2CLHD-6zKqSwxnB0FWvUr6IZ4d2NT9vCZFflF4EvagesVmW-uoLYYHUb5LcX?key=CfrEk0AtG9sqjC5RFufK8g)

To see the changes made by other users, the local state need to be updated very frequently

Challenge 2 \. ![](https://lh7-us.googleusercontent.com/docsz/AD_4nXfMIPvQejpSRDiLeNUzbPoHBhHucXkouyxf6jdLBbz8HkKzmAwH3yymSSPQmGZzRhCUMCZuCqdreyttahBEuZUpIiiRWnHt7OTAsLVd7pw4YoY_Z-uJEokZ1m4QRLDhNtK9NO6g8wM6AkWbeSwHWMxP0k5p?key=CfrEk0AtG9sqjC5RFufK8g)

Challenge 3\.

 ![](https://lh7-us.googleusercontent.com/docsz/AD_4nXd-dGj2rJ6YPIKQhAM8cHoHWQTXgEUUqAZHymxXp6LV5q9x2bvJW1wdJXl2J-l3-VaNaJjP0xznKGow1ROjf0-_i5Fp1nIEtHb1pARwUdIwnpWfChaMqW7-PP7OBC3apJMbS6PpzuPPiJJwbf65BAzFRUcj?key=CfrEk0AtG9sqjC5RFufK8g)

Challenge 4 

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXd4aOj_gydCDvYGkRdyAB5FZIVv4iScf6uA4C4isPqtdV6rXPy2iBevmhdIsKD-g7vicExXvraquOBT2sLApu_EV1M7SUNBjJoGC81E8-w2dMiuMOBXX964eSQFGJK2y7Q2oxmlcF259C-3KiJ33eWZAPL6?key=CfrEk0AtG9sqjC5RFufK8g)

Challenge 5\.

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXeiIcbbtjfIBOonYRq1vwVeyejIaNVrnQQeyVxyRv4yJ7khCeffZzhQjvVV3H6u7xPzfN4KltkQgFJraqypyz_G4J5mwIR8r_8E1mjP6AnqjTtgiA4Jr1k6srS1cs5NLuejh1Y7CRSgMgzqDfkl42LLChOr?key=CfrEk0AtG9sqjC5RFufK8g)

\. Eventual Consistency is a guarantee that when an update is made in a distributed database, that update will eventually be reflected in all nodes that store the data, resulting in the same response every time the data is queried

\. CRDT : The primary functionality of CRDT is to enable independent data update operations on multiple replicas and still achieve a consistent state across all replicas. Key features include: Strong eventual consistency. Concurrency and fault-tolerance.

16\. CRDT Limitation:  Optimizing space and computational efficiencies can be difficult in some CRDT models. Merging operations sometimes require manual interference

\. YJS:

Yjs is a shared editing framework. It exposes Shared Types that can be manipulated like any other data type. But they are synced automatically!

\. Why IndexedDB: 

IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs. This API uses indexes to enable high-performance searches of this data. While Web Storage is useful for storing smaller amounts of data, it is less useful for storing larger amounts of structured data
