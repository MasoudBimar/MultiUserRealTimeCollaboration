# Multi-User Real-Time Collaboration App Creatingly

1\. The real-time collaboration is when multiple users are able to work together on the same document or project simultaneously such that any changes and updates that are being made will be reflected in real-time for all 

This is possible due to technologies such as WebSockets as well as server-side synchronization that provides real-time data exchange and communication.



To see the changes made by other users, the local state need to be updated very frequently

\. Eventual Consistency is a guarantee that when an update is made in a distributed database, that update will eventually be reflected in all nodes that store the data, resulting in the same response every time the data is queried

\. CRDT : The primary functionality of CRDT is to enable independent data update operations on multiple replicas and still achieve a consistent state across all replicas. Key features include: Strong eventual consistency. Concurrency and fault-tolerance.

16\. CRDT Limitation:  Optimizing space and computational efficiencies can be difficult in some CRDT models. Merging operations sometimes require manual interference

\. YJS:

Yjs is a shared editing framework. It exposes Shared Types that can be manipulated like any other data type. But they are synced automatically!

\. Why IndexedDB: 

IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs. This API uses indexes to enable high-performance searches of this data. While Web Storage is useful for storing smaller amounts of data, it is less useful for storing larger amounts of structured data
