from nltk.stem import PorterStemmer, WordNetLemmatizer
from nltk.corpus import stopwords


stop = set(stopwords.words('english'))
profane_words =set(stopwords.words('profane_words'))
stemmer = PorterStemmer()
lemmatiser = WordNetLemmatizer()
word=[]
lemmatise_word=[]
bad_words=[]

#The sentence
sentence = "I want to boycott Jewish"
sentence=sentence.replace("'"," ")

#Remove the stopword
for i in sentence.lower().split():
    if i not in stop:
        word.append(i)

#print("Stem %s: %s" % ("studying", stemmer.stem("studying")))
#print("Lemmatise %s: %s" % ("studying", lemmatiser.lemmatize("studying")))

#Lemmatise each word and save it in a list
for words in word:
    lemmatise_word.append(lemmatiser.lemmatize(words, pos="v"))

new_str =' '.join(lemmatise_word)
#Check if the words are profane or not


for i in sentence.lower().split():
    if i in profane_words:
        bad_words.append(i)

#List of bad words 
print(bad_words)

