"use client"
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import api from '@/app/lib/axios';
import { toast } from 'sonner';
import { Trash2, Loader2 } from 'lucide-react';
import { Note } from '@/type/note.type';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

type NotesTabProps = {
    lessonId: string;
};

const NotesTab: React.FC<NotesTabProps> = ({ lessonId }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNoteContent, setNewNoteContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotes = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/notes', { params: { lesson_id: lessonId } });
                const data = Array.isArray(response.data) ? response.data : response.data.notes ?? [];
                setNotes(data);
            } catch (error) {
                console.error('Error fetching notes:', error);
                toast.error('Không thể tải ghi chú');
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotes();
    }, [lessonId]);

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNoteContent.trim()) {
            toast.error('Vui lòng nhập nội dung ghi chú');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await api.post('/notes/create', {
                lesson_id: lessonId,
                content: newNoteContent
            });
            setNotes(prev => [response.data, ...prev]);
            setNewNoteContent('');
            toast.success('Tạo ghi chú thành công!');
        } catch (error) {
            console.error('Error creating note:', error);
            toast.error('Không thể tạo ghi chú');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        try {
            await api.delete(`/notes/${noteId}`);
            setNotes(prev => prev.filter(note => note.note_id !== noteId));
            toast.success('Xóa ghi chú thành công!');
        } catch (error) {
            console.error('Error deleting note:', error);
            toast.error('Không thể xóa ghi chú');
        } finally {
            setDeleteNoteId(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
            <Tabs defaultValue="list" className="w-full">
                <TabsList>
                    <TabsTrigger value="list" className='pl-5'>Ghi chú của tôi</TabsTrigger>
                    <TabsTrigger value="create" className='pl-5'>Thêm ghi chú mới</TabsTrigger>
                </TabsList>
                <TabsContent value="list" className='pl-5 pt-3'>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
                        </div>
                    ) : notes.length === 0 ? (
                        <p className="text-gray-500">Bạn chưa có ghi chú nào ở bài học này</p>
                    ) : (
                        <div className="space-y-4">
                            {notes.map((note) => (
                                <div key={note.note_id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm text-gray-500">{formatDate(note.createdAt)}</span>
                                        <Button variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteNoteId(note.note_id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="create" className='pl-5'>
                    <form onSubmit={handleCreateNote} className='flex gap-5 justify-baseline flex-col'>
                        <Textarea
                            placeholder='Thêm ghi chú của bạn vào đây...'
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            rows={6}
                            disabled={isSubmitting}
                        />
                        <Button
                            type="submit"
                            className='cursor-pointer inline-block align-bottom'
                            disabled={isSubmitting || !newNoteContent.trim()}>
                            {isSubmitting ? (
                                <div>
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Đang lưu...
                                </div>
                            ) : (
                                'Tạo ghi chú'
                            )}
                        </Button>
                    </form>
                </TabsContent>
            </Tabs>

            <AlertDialog open={!!deleteNoteId} onOpenChange={() => setDeleteNoteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa ghi chú</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa ghi chú này? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteNoteId && handleDeleteNote(deleteNoteId)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default NotesTab;
