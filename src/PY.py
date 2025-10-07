# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

from surprise import SlopeOne, KNNBasic, BaselineOnly, Dataset, Reader
from sklearn.preprocessing import MinMaxScaler

# --------------------------------------------------
# 1) SlopeOne Recommender
# --------------------------------------------------
class BookRecommender:
    def __init__(self, file_path, use_author=True, rating_method='minmax_1_5'):
        self.file_path = file_path
        self.use_author = use_author
        self.rating_method = rating_method
        self.df = None
        self.algo = None

    def load_data(self):
        raw = pd.read_excel(self.file_path)
        for col in ['Patron Barcode','Item Barcode','Title','Author','Name','Type']:
            if col in raw.columns: raw[col] = raw[col].astype(str).str.strip()
        raw['Item'] = raw['Title'] + ' - ' + raw['Author'] if (self.use_author and 'Author' in raw.columns) else raw['Title']
        raw['BorrowCount'] = raw.groupby(['Patron Barcode','Item'])['Item Barcode'].transform('count')
        if self.rating_method == 'minmax_1_5':
            raw['Rating'] = MinMaxScaler((1,5)).fit_transform(raw[['BorrowCount']])
        elif self.rating_method == 'raw':
            raw['Rating'] = raw['BorrowCount']
        else:
            raw['Rating'] = raw['BorrowCount'].clip(upper=5)
        self.df = raw[['Patron Barcode','Item','Rating']].drop_duplicates()
        self.df['Patron Barcode'] = self.df['Patron Barcode'].astype(str)

    def train_model(self):
        rmin, rmax = float(self.df['Rating'].min()), float(self.df['Rating'].max())
        if rmax==rmin: rmin,rmax = max(0.0,rmin-0.5),rmax+0.5
        reader = Reader(rating_scale=(rmin,rmax))
        data = Dataset.load_from_df(self.df[['Patron Barcode','Item','Rating']], reader)
        self.algo = SlopeOne()
        self.algo.fit(data.build_full_trainset())

    def recommend(self, patron_barcode, n=10):
        user = str(patron_barcode)
        seen = set(self.df.loc[self.df['Patron Barcode']==user,'Item'])
        candidates = [it for it in self.df['Item'].unique() if it not in seen]
        preds=[]
        for it in candidates:
            try:
                est=self.algo.predict(user,it).est
                preds.append((it,float(est)))
            except: pass
        preds.sort(key=lambda x:(-x[1],x[0]))
        return [i for i,_ in preds[:n]], [s for _,s in preds[:n]]

# --------------------------------------------------
# 2) KNNBasic Recommender
# --------------------------------------------------
class KNNBookRecommender:
    def __init__(self, file_path, k=40, user_based=True, use_author=True,
                 rating_method='minmax_1_5', sim_name='cosine'):
        self.file_path=file_path; self.k=k; self.user_based=user_based
        self.use_author=use_author; self.rating_method=rating_method; self.sim_name=sim_name
        self.df=None; self.algo=None

    def load_data(self):
        raw=pd.read_excel(self.file_path)
        for col in ['Patron Barcode','Item Barcode','Title','Author','Name','Type']:
            if col in raw.columns: raw[col]=raw[col].astype(str).str.strip()
        raw['Item']=raw['Title']+' - '+raw['Author'] if (self.use_author and 'Author' in raw.columns) else raw['Title']
        raw['BorrowCount']=raw.groupby(['Patron Barcode','Item'])['Item Barcode'].transform('count')
        if self.rating_method=='minmax_1_5':
            raw['Rating']=MinMaxScaler((1,5)).fit_transform(raw[['BorrowCount']])
        elif self.rating_method=='raw': raw['Rating']=raw['BorrowCount']
        else: raw['Rating']=raw['BorrowCount'].clip(upper=5)
        self.df=raw[['Patron Barcode','Item','Rating']].drop_duplicates()
        self.df['Patron Barcode']=self.df['Patron Barcode'].astype(str)

    def train_model(self):
        rmin,rmax=float(self.df['Rating'].min()),float(self.df['Rating'].max())
        if rmax==rmin: rmin,rmax=max(0.0,rmin-0.5),rmax+0.5
        reader=Reader(rating_scale=(rmin,rmax))
        data=Dataset.load_from_df(self.df[['Patron Barcode','Item','Rating']],reader)
        self.algo=KNNBasic(k=self.k,min_k=1,
                           sim_options={'name':self.sim_name,'user_based':self.user_based})
        self.algo.fit(data.build_full_trainset())

    def recommend(self,patron_barcode,n=10):
        user=str(patron_barcode)
        seen=set(self.df.loc[self.df['Patron Barcode']==user,'Item'])
        candidates=[it for it in self.df['Item'].unique() if it not in seen]
        preds=[]
        for it in candidates:
            try:
                est=self.algo.predict(user,it).est
                preds.append((it,float(est)))
            except: pass
        preds.sort(key=lambda x:(-x[1],x[0]))
        return [i for i,_ in preds[:n]],[s for _,s in preds[:n]]

# --------------------------------------------------
# 3) BaselineOnly Recommender
# --------------------------------------------------
class BaselineBookRecommender:
    def __init__(self,file_path,use_author=True,rating_method='minmax_1_5'):
        self.file_path=file_path; self.use_author=use_author; self.rating_method=rating_method
        self.df=None; self.algo=None

    def load_data(self):
        raw=pd.read_excel(self.file_path)
        for col in ['Patron Barcode','Item Barcode','Title','Author','Name','Type']:
            if col in raw.columns: raw[col]=raw[col].astype(str).str.strip()
        raw['Item']=raw['Title']+' - '+raw['Author'] if (self.use_author and 'Author' in raw.columns) else raw['Title']
        raw['BorrowCount']=raw.groupby(['Patron Barcode','Item'])['Item Barcode'].transform('count')
        if self.rating_method=='minmax_1_5':
            raw['Rating']=MinMaxScaler((1,5)).fit_transform(raw[['BorrowCount']])
        elif self.rating_method=='raw': raw['Rating']=raw['BorrowCount']
        else: raw['Rating']=raw['BorrowCount'].clip(upper=5)
        self.df=raw[['Patron Barcode','Item','Rating']].drop_duplicates()
        self.df['Patron Barcode']=self.df['Patron Barcode'].astype(str)

    def train_model(self):
        rmin,rmax=float(self.df['Rating'].min()),float(self.df['Rating'].max())
        if rmax==rmin: rmin,rmax=max(0.0,rmin-0.5),rmax+0.5
        reader=Reader(rating_scale=(rmin,rmax))
        data=Dataset.load_from_df(self.df[['Patron Barcode','Item','Rating']],reader)
        self.algo=BaselineOnly()
        self.algo.fit(data.build_full_trainset())

    def recommend(self,patron_barcode,n=10):
        user=str(patron_barcode)
        seen=set(self.df.loc[self.df['Patron Barcode']==user,'Item'])
        candidates=[it for it in self.df['Item'].unique() if it not in seen]
        preds=[]
        for it in candidates:
            try:
                est=self.algo.predict(user,it).est
                preds.append((it,float(est)))
            except: pass
        preds.sort(key=lambda x:(-x[1],x[0]))
        return [i for i,_ in preds[:n]],[s for _,s in preds[:n]]

# --------------------------------------------------
# Main
# --------------------------------------------------
def main():
    FILE_PATH="/content/drive/MyDrive/Dataset/library_data_processed.xlsx"
    TOPN=10

    slope=BookRecommender(FILE_PATH)
    slope.load_data(); slope.train_model()

    knn=KNNBookRecommender(FILE_PATH,k=30,user_based=True,sim_name='cosine')
    knn.load_data(); knn.train_model()

    base=BaselineBookRecommender(FILE_PATH)
    base.load_data(); base.train_model()

    # ให้ผู้ใช้กรอก Patron เอง
    patron=input("กรอก Patron Barcode: ").strip()
    if not patron:
        patron=slope.df['Patron Barcode'].iloc[0]

    slope_items,slope_scores=slope.recommend(patron,n=TOPN)
    knn_items,knn_scores=knn.recommend(patron,n=TOPN)
    base_items,base_scores=base.recommend(patron,n=TOPN)

    print("\n=== ผลลัพธ์สำหรับผู้ใช้:",patron,"===\n")
    print("— SlopeOne —")
    for i,(it,sc) in enumerate(zip(slope_items,slope_scores),1):
        print(f"{i:>2}. {it} | {sc:.3f}")
    print("\n— KNNBasic —")
    for i,(it,sc) in enumerate(zip(knn_items,knn_scores),1):
        print(f"{i:>2}. {it} | {sc:.3f}")
    print("\n— BaselineOnly —")
    for i,(it,sc) in enumerate(zip(base_items,base_scores),1):
        print(f"{i:>2}. {it} | {sc:.3f}")

if __name__=="__main__":
    main()
